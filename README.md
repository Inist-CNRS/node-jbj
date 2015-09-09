# JBJ : transform Json By Json

A new way to transform JSON object with a JSON stylesheet. It's like XSL/XML but only with JSON.

## Contributors

  * [Nicolas Thouvenin](https://github.com/touv)

# Installation

With [npm](http://npmjs.org) do:

    $ npm install jbj


# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ npm install
    $ npm test

# Documentation

## API

### render(stylesheet : Object, input : Mixed, callback : Function) : None

Render `input` with `stylesheet`.
```javascript
	var JBJ = require('jbj'),
	JBJ.render({ "truncate" : 3 }, "1234", function(err, out) {
			console.log(out);
	});

	// Output : 123

```

### renderSync(stylesheet : Object, input : Mixed) : Object

Render `input` with `stylesheet`.
```javascript
	var JBJ = require('jbj'),
	out = JBJ.renderSync({ "truncate" : 3 }, "1234");

	console.log(out);

	// Output : 123
```

### register(protocol : String, callback : Function) : None
Add a function to fetch data for a specific protocol
```javascript
	JBJ.register('http:', function request(urlObj, callback) {
		var buf = ''
	      , req = require('http').get(urlObj, function(res) {
			if (res.statusCode !== 200) {
				return callback(new Error('HTTP Error ' + res.statusCode));
			}
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
			  buf += chunk.toString();
			});
			res.on('error', callback);
			res.on('end', function() {
			  callback(null, buf);
			});
		});
		req.on('error', callback);
	});
```
### Adding filters/actions

To add a filter simply add a method to the .filters object:

```javascript
	jbj.filters.concatx = function(obj, args) {
		return String(obj) + String(args) + 'X;
	};
```

## Source

Stylesheet can contain a reference to data source. Source can be a file or an URL.
By default, only the *file:* protocol is supported. Add your own protocol with *register*

```javascript
	var stylesheet_1 = {
      "$?" : "https://raw.githubusercontent.com/castorjs/node-jbj/master/package.json",
      "$name" : {
        "upcase": true
      },
      "$main": {
        "upcase": true
      }
    };
	var stylesheet_2 = {
      "$name" : {
        "$?" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
        "parseJSON" : true,
        "path": "name"
      },
      "$main": {
        "$?" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
        "parseJSON" : true,
        "path": "main",
      }
    };
```



## Variables

Variable can be set using $ plus a dot notation path.

```javascript
	var stylesheet = {
		"$x" : {
			"get": "a.b.c",
		},
		"$y.y1.y2" : {
			"get": "a.d"
		}
	}

```


## Template

A template is JSON object where each key is an action. All actions are described below.

<a id="set"></a>
### set: value
Set value and ignore *input*
```javascript
	var stylesheet1 = {
		"set": "value"
	};
	var stylesheet2 = {
		"set": ["value", "value", "value"]
	};
	var stylesheet3 = {
		"set": {
			"a": 1,
			"b": 2
		}
	};
```

<a id="get"></a>
### get: path | [path,path, ...]

*aliases : find , path*

Get value in *input* with some paths (with dot notation style)
```javascript
	var stylesheet1 = {
		"set": {
			"a" : {
				"b" : {
					"c" : "Yo"
				}
			}
		},
		"get": "a.b.c"
	};
	// output : Yo
	var stylesheet2 = {
		"set" : {
			"a" : {
				"b" : 1,
				"c" : 2,
				"d" : 3
			}
		},
		"get": ["a.b", "a.c", "a.d"]
	};
// output : [1, 2, 3]
```

<a id="default"></a>
### default: value
Fix value if *input* is not set
```javascript
	var stylesheet = {
		var stylesheet = {
			"default": "value"
		};
	};
```

<a id="debug"></a>
### debug: none
Print *input* with console.log
```javascript
	var stylesheet = {
		"set": "value",
		"debug": true
	};
	// output: value
```

<a id="foreach"></a>
### foreach: stylesheet
Apply stylesheet on all elements of *input*
```javascript
	var stylesheet1 = {
		"set": ["value", "value", "value"]
		"foreach" : {
			"upcase" : true
		}
	};
	// output : ["VALUE", "VALUE", "VALUE"]
	var stylesheet2 = {
		"set": [
			{ "b" : "x" },
			{ "b" : "y" }
		],
		"foreach" : {
			"get": "b",
			"upcase" : true
		}
	};
	// output : ["X", "Y"]
	var stylesheet3 = {
		"set": [
			{ "b" : "x" },
			{ "b" : "y" }
		],
		"foreach" : {
			"$b" : {
				"get": "b",
				"upcase" : true
			}
		}
	};
	// output : [ { "b" : "X" }, { "b" : "Y" } ]
```

<a id="extend"></a>
### extend: object

*aliases : extendWith*

Extend *input* with another object
```javascript
	var stylesheet = {
		"set": {
			"a" : 1
		},
		"extend" : {
			"b" : 2
		}
	};
	// output : { a: 1, b: 2}
```

<a id="select"></a>
### select: path | [path, path, ...]
Peck element(s) in *input* with "CSS selector"
```javascript
	var stylesheet = {
		"set" : {
			"a" : {
				"b" : [
					{ "c" : "1" },
					{ "c" : "2" }
				]
			}
		},
		"select" : ".a > .b .#c"
	};
	// output : [1, 2]
```
for syntax see [JSONSelect](http://jsonselect.org/)

<a id="mapping"></a>
### mapping: object
Replace a value by the matching value in the object.

```javascript
{
  "set": "one",
  "mapping": {
    "one": 1
  }
}
// output: 1
```

```javascript
{
  "set": "FR",
  "mapping": {
    "US": "United States of America",
    "FR": "France"
  }
}
// output: "France"
```

Can also replace the values of an array with the matching values in the object.

```javascript
{
  "set": [1, 2],
  "mapping": ["a","b","c"]
}
// output: ["b","c"]
```

```javascript
{
  "set": ["a", "b"],
  "mapping": {
    "a": "Aha!",
    "b": "Baby"
  }
}
// output: ["Aha!","Baby"]
```

<a id="mappingVar"></a>
### mappingVar: ["input","table"]

*alias*: combine

Replace the content of the `input` variable according to the content of the `table` variable.

```javascript
var input = {
  "arg": { "a": "Aha!", "b": "Baby"},
  "input": "a"
};
var stylesheet = {
  "mappingVar": ["input", "arg"]
};
var output = JBJ.renderSync(stylesheet, input);
// output "Aha!";
```

<a id="array2object"></a>
### array2object: [key, value]

Convert an array, which items have `key` and `value` properties, to an associative array (or object), which key properties are `key` values and values are `value` values.

> *Note*: when the parameter is not a two items array, its default value is `["_id","value"]`.

Ex:

```javascript
var stylesheet = {
  "set": [
    {
      "_id": "2007",
      "value": 538
    }, {
      "_id": "2008",
      "value": 577
    }, {
      "_id": "2009",
      "value": 611
  }],
  "array2object": true
};
// output = { "2007": 538, "2008": 577, "2009": 611 }

var stylesheet = {
  "set": [
    {
      "key": "2007",
      "val": 538
    }, {
      "key": "2008",
      "val": 577
    }, {
      "key": "2009",
      "val": 611
  }],
  "array2object": ["key","val"]
};
// output = { "2007": 538, "2008": 577, "2009": 611 }
```

<a id="arrays2objects"></a>
### arrays2objects: [key, value]

Convert an array of arrays (of 2 items), to an array of objects, where the first key if `key` and the second `value`). Defailt value of `key`: `_id`, default value of `value`: `value`.

> *Note*: this is useful to prepare data from a CSV file to be treated with `array2object`.

Ex:

```javascript
var stylesheet = {
  "set": [ [ "Afghanistan", "AFG" ],
           [ "Aland Islands", "ALA" ] ],
  "arrays2objects": ["key", "val"]
};
// output: [ { "key": "Afghanistan", "val": "AFG"},
//           { "key": "Aland Islands", "val": "ALA"} ]
```

```javascript
var stylesheet = {
  "set": [ [ "Afghanistan", "AFG" ],
           [ "Aland Islands", "ALA" ] ],
  "arrays2objects": true
};
// output: [ { "_id": "Afghanistan", "value": "AFG"},
//           { "_id": "Aland Islands", "value": "ALA"} ]
```

<a id="zip"></a>
### zip: ["array1","array2"]

Join two arrays (which elements have an `_id` and a `value` keys).

```javascript
var stylesheet = {
  "set": {
    "array1": [{"_id": "1", "value": 1},  {"_id": "2", "value": 2}],
    "array2": [{"_id": "1", "value": 10}, {"_id": "2", "value": 20}]
  },
  "zip": [ "array1", "array2" ]
};
var output = JBJ.renderSync(stylesheet);
// output: [ { _id: '1', array1: 1, array2: 10 },
//           { _id: '2', array1: 2, array2: 20 } ]

```

<a id="cast"></a>
### cast: (number|string|boolean) | [(string|date), pattern]
Convert *input* to specific type
```javascript
	var stylesheet1 = {
		"set" : "1"
		"cast": "number"
	};
	// output : 1
	var stylesheet2 = {
		"set" : 1
		"cast": "string"
	};
	// output: "1"
```
for syntax see [transtype](https://github.com/touv/transtype)


<a id="mask"></a>
### mask: pattern
Selecting specific parts of *input*, hiding the rest, return object
```javascript
	var stylesheet = {
		"set" : {
			"a" : 1,
			"b" : 2,
			"c" : 3
		},
		"mask": "a,c"
	};
	// output : { a: 1, c: 3}
```
for syntax see [json-mask](https://github.com/nemtsov/json-mask)

<a id="csv"></a>
### csv: separator
Pack *input* to CSV, return string
```javascript
	var stylesheet = {
		"set" : ["x","y","z"],
		"csv" : ","
	};
	// output : "x,y,z"\r\n
```

<a id="parseCSV"></a>
### parseCSV: separator

*aliases : parseCSVField, fromCSV, uncsv*

Parse *input* as CSV string, return array
```javascript
	var stylesheet = {
		"set" : "x,y,z",
		"parseCSV": ",",
	};
	// output : ["x","y","z"]
```

<a id="parseCSVFile"></a>
### parseCSVFile: separator

*alias : fromCSVFile*

Parse *input* as CSV string, return an array of arrays of columns content.

```javascript
	var stylesheet = {
		"set" : "\"Afghanistan\";\"AFG\"\n\"Aland Islands\";\"ALA\"",
		"parseCSVFile": ";",
	};
	// output : [ [ 'Afghanistan', 'AFG' ], [ 'Aland Islands', 'ALA' ] ]
```

<a id="json"></a>
### json: none

*alias : toJSON*

Pack *input* to JSON, return string
```javascript
	var stylesheet = {
		"set" : ["x","y","z"],
		"json": true
	};
	// output : "[\"x\",\"y\",\"z\"]"
```

> **Warning**: when parsing a whole CSV file, be aware that file line columns can't have space in their names, neither special characters (they must fit in variable names)

<a id="parseJSON"></a>
### parseJSON:

*aliases : fromJSON, unjson*

Parse *input* as JSON string, return object
```javascript
	var stylesheet = {
		"set" : "[\"x\",\"y\",\"z\"]",
		"parseJSON": true
	};
	// output : ["x","y","z"]
```

<a id="xml"></a>
### xml: options
Pack *input* to XML, return string

*options* are detailed in the [xml-mapping](https://github.com/touv/node-xml-mapping#options-1) documentation
```javascript
	var stylesheet = {
		"set": {
			"root" : {
				"item" : [
					{ "index" : "1", "$t" : "A"},
					{ "index" : "2", "$t" : "B"},
					{ "index" : "3", "$t" : "C"}
				]
			}
		},
		"xml" : {
			"indent": false
		}
	};
	// output : <root><item index="1">A</item><item index="2">B</item><item index="3">C</item></root>
```

<a id="parseXML"></a>
### parseXML: options

*aliases : fromXML, unxml*

Parse *input* as XML string, return object

*options* are detailed in the [xml-mapping](https://github.com/touv/node-xml-mapping#options) documentation
```javascript
	var stylesheet = {
		"set": "<root><item xml:id=\"1\">A</item><item xml:id=\"2\">B</item><item xml:id=\"3\">C</item></root>",
		"parseXML" : {
			"specialChar": "#",
			"longTag" : true
		}
	};
	// output : { root : { item : [ { xml#id: 1, #text: A }, { xml#id: 2, #text: B }, { xml#id: 3, #text: C } ] } }
```

<a id="coalesce"></a>
### coalesce: none
Get the first non-undefined value
```javascript
	var stylesheet = {
		"set" : [null, undefined, null, "a", "b"],
		"coalesce": true
	};
	// output : "a"
```

<a id="required"></a>
### required: none
If *input* is not set, return Error

<a id="trim"></a>
### trim: none
Trim *input*, return string
```javascript
	var stylesheet = {
		"set" : "    xxx    ",
		"trim: true
	};
	// output : "xxx"
```

<a id="template"></a>
### template:  mustacheTemplate | [mustacheTemplate, mustacheTemplate, ...]
Build a string with mustache template and *input*
```javascript
	var stylesheet = {
		"set" : {
			"a" : {
				"b" : "hello"
			},
			"c" : "world"
		},
		"template": "I say {{a.b}} to the {{c}}"
	};
	// output : I say hello to the world
```

<a id="compute"></a>
### compute: expression

Compute an expression with all variables of the *input*.
Note : `this` variable contains *input*
```javascript
	var stylesheet = {
		"set" : {
			"a" : 20,
			"b" : 3,
			"c" : 5,
			"d" : 8
		},
		"$x" : {
			"compute#1": "a / b",
			"compute#2": "round(this)",
			"cast": "number"
		},
		"$y" : {
			"path": "b",
			"cast": "number"
		},
		"$z" : {
			"compute": "x + y",
		}
	};
	// output : 10
```

<a id="assert"></a>
### assert: expression

If expression is true, then statements will be continued, otherwise it is stopped and  it returns null
Note : `this` variable contains *input*
```javascript
	var stylesheet1 = {
		"set" : {
			"a" : 1
		},
		"$val#1" : {
			"assert": "a == 1",
			"set" : "if val"
		}
	};
	// output : "if val"
	var stylesheet2 = {
		"set" : {
			"a" : 0
		},
		"$val#1" : {
			"assert": "a == 1",
			"set" : "if val"
		},
	    "$val#2" : {
			"get" : "val",
	        "default": "else val",
		  }
	};
	// output : "else val"

```


<a id="capitalize"></a>
### capitalize:
Capitalize the first letter of *input*
```javascript
	var stylesheet = {
		"set" : "xyz",
		"capitalize": true
	};
	// output : "Xyz"
```

<a id="downcase"></a>
### downcase:
Downcase *input*
```javascript
	var stylesheet = {
		"set" : "XYZ",
		"downcase": true
	};
	// output : "xyz"
```

<a id="upcase"></a>
### upcase:
Uppercase *input*
```javascript
	var stylesheet = {
		"set" : "xyz",
		"upcase": true
	};
	// output : "XYZ"
```

<a id="substring"></a>
### substring: [offset]|[offset, length]

*aliases : substr*

```javascript
    var stylesheet = {
      "set"       : "20150310",
      "substring" : [4,2]
    };
    // output : "03"
```

<a id="first"></a>
### first:
Get the first element of *input*
```javascript
	var stylesheet = {
		"set" : ["a", "b", "c"],
		"first": true
	};
	// output : "a"
```

<a id="last"></a>
### last:
Get the last element of *input*
```javascript
	var stylesheet = {
		"set" : ["a", "b", "c"],
		"last": true
	};
	// output : "c"
```

<a id="sort"></a>
### sort:
Sort *input* object or array.

```javascript
	var stylesheet = {
		"set": ["b", "c", "a"],
		"sort": true
	};
	// output : ["a", "b", "c"]
```

<a id="sortBy"></a>
### sortBy: prop | [prop, prop, ...]

*aliases : sort_by*

Sort *input* object the given `prop` ascending.

<a id="size"></a>
### size:

*aliases : length*

Get the size or the length of *input*
```javascript
	var stylesheet1 = {
		"set" : "12345",
		"size": true
	};
	var stylesheet2 = {
		"set" : [1,2,3,4,5],
		"size": true
	};
	// output : 5
```
<a id="max"></a>
### max:
Add *input* and *value*
```javascript
	var stylesheet1 = {
		"set" : [2, 4, 1, 7, 9, 3],
		"max" : true
	};
	// output : 9
	var stylesheet2 = {
		"set" : {a: 9, b: 4, c: 3, d: 5},
		"max" : true
	};
	// output : 9
```

<a id="min"></a>
### min:
Subtract *value* from *input*
```javascript
	var stylesheet1 = {
		"set" : [2, 4, 1, 7, 9, 3],
		"min" : true
	};
	// output : 1
	var stylesheet2 = {
		"set" : {a: 9, b: 4, c: 3, d: 5},
		"min" : true
	};
	// output : 3
```

<a id="plus"></a>
### plus: value | [value, value, ...]
Add *input* and *value*
```javascript
	var stylesheet = {
		"set" : 4,
		"plus": 3
	};
	// output : 7
	var stylesheet = {
		"set" : 4,
		"plus": [1,2,3]
	};
	// output : [5,6,7]
```

<a id="minus"></a>
### minus: value | [value, value, ...]
Subtract *value* from *input*
```javascript
	var stylesheet = {
		"set" : 4,
		"minus": 3
	};
	// output : 1
	var stylesheet = {
		"set" : 4,
		"minus": [1,2,3]
	};
	// output : [3,2,1]
```

<a id="times"></a>
### times: value | [value, value, ...]
Multiply *input* by *value*"
```javascript
	var stylesheet = {
		"set" : 5,
		"times": 5
	};
	// output : 25
	var stylesheet = {
		"set" : 4,
		"times": [1,2,3]
	};
	// output : [4,8,12]
```

<a id="dividedBy"></a>
### dividedBy: value | [value, value, ...]

*aliases : divided_by*

Divide *input* by *value*"
```javascript
	var stylesheet = {
		"set" : 10,
		"dividedBy": 2
	};
	// output : 5
	var stylesheet = {
		"set" : 4,
		"times": [1,2]
	};
	// output : [4,2]
```

<a id="join"></a>
### join: string = ', '

*aliases : glue*

Join *input* with the given *string*.
```javascript
	var stylesheet = {
		"set" : ["a","b","c"],
		"join": " | "
	};
	// output : "a | b | c"
```

<a id="shift"></a>
### shift: n | [n, n, ...]
Shift *input* to the left by *n*
```javascript
	var stylesheet = {
		"set" : "The world",
		"shift": 4
	};
	// output : "world"
	var stylesheet = {
		"set" : [1,2,3,4,5],
		"shift": 2
	};
	// output : [3,4,5]
	var stylesheet = {
		"set" : [1,2,3,4,5],
		"shift": [2,3]
	};
	// output : [[3,4,5],[4,5]]
```

<a id="truncate"></a>
### truncate: length | [length, length, ...]
Truncate *input* to *length*.
```javascript
	var stylesheet = {
		"set" : "hello world",
		"truncate": 5
	};
	// output : "hello"
```

<a id="truncateWords"></a>
### truncateWords: n | [n, n, ...]

*aliases : truncate_words*

Truncate *input* to *n* words (separator: space).

```javascript
	var stylesheet = {
		"set" : "This is JBJ!",
		"truncateWords": 2
	}
	// output "This is"
	var stylesheet = {
		"set" : "This is JBJ!",
		"truncateWords": [1,2]
	}
	// output ["This","This is"]
```

<a id="replace"></a>
### replace: [pattern, substitution] | pattern
Replace *pattern* with *substitution* in *input*.
```javascript
	var stylesheet = {
		"set" : "XoXoXoX",
		"replace": ["o", "."]
	};
	// output :  X.X.X.X
	var stylesheet = {
		"set" : "XoXoXoX",
		"replace": "o"
	};
	// output :  XXXX
```

<a id="prepend"></a>
### prepend: something | [something, something, ...]
Prepend *something* to *input*
```javascript
	var stylesheet = {
		"set" : "world"
		"prepend": "hello"
	};
	// output : "hello world"
	var stylesheet = {
		"set" : "h"
		"prepend": ["a","e","i","o","u"]
	};
	// output : ["ah","eh","ih","oh","uh"]
```

<a id="append"></a>
### append: something | [something, something, ...]
Append *something* to *input*
```javascript
	var stylesheet = {
		"set" : "cool",
		"append": "!"
	};
	// output : "cool!"
	var stylesheet = {
		"set" : "cool",
		"append": ["!","?","."]
	};
	// output : ["cool!","cool?","cool."]
```

<a id="reverse"></a>
### reverse:
Reverse items order of *input*
```javascript
	var stylesheet = {
		"set" : [1,2,3]
	};
	// output : [3,2,1]
```

<a id="flatten"></a>
### flatten:
Flatten an array.
```javascript
    var stylesheet = {
      "set"     : [ ['a', 'b'], ['c', 'd'], 'e'],
      "flatten" : true
    };
	// output : ["a","b","c","d","e"]
```

<a id="deduplicate"></a>
### deduplicate:
*aliases : dedupe , unique*

Deduplicate values in an array.

```javascript
    var stylesheet = {
      "set"         : [ 1, 2, 3, 1, 2],
      "deduplicate" : true
    };
	// output : [1,2,3]
```

<a id="remove"></a>
### remove:
*alias : del*

Remove one value in an array.

```javascript
    var stylesheet = {
      "set"    : [ 1, 2, 3],
      "remove" : 2
    };
	// output : [1,3]
    var stylesheet = {
      "set"    : [ "a", "", "b"],
      "remove" : ""
    };
    // output : ["a","b"]
    var stylesheet = {
      "set"    : [ "a", "b", "c"],
      "remove" : "b"
    };
    // output : ["a","c"]
```

<a id="getproperty"></a>
<a id="getindex"></a>
### getindex: property | index
*aliases : getProperty, getproperty, getIndex*

Get a property of an object, or an item of an array.

```javascript
var stylesheet = {
  "set"        : [ "a", "b", "c" ],
  "getindex": "2"
};
// output : "c"
var stylesheet = {
  "set"        : { "a": 0, "b": 1, "c":2 },
  "getproperty": "b"
};
// output : 1
```

<a id="getpropertyvar"></a>
<a id="getindexvar"></a>
### getindexvar: [ arrayName | objectName , propertyName | indexName ]
*aliases : getPropertyVar, getpropertyvar, getIndexVar*

Get a property of an object, or an item of an array, like [getindex](#getindex), but using variables.

```javascript
var stylesheet = {
  "set": {
    "i": 1,
    "t": ["a","b","c"]
  },
  "getIndexVar": ["t", "i"]
};
// output : "b"
var stylesheet = {
  "set": {
    "i" : "b",
    "o" : { "a": 0, "b": 1, "c":2 },
  },
  "getPropertyVar": ["o", "i"]
};
// output : 1
```

<a id="sum"></a>
### sum:
*alias : total*

Return the sum of all the value of an array.

```javascript
    var stylesheet = {
      "set"    : [ 1, 2, 3],
      "sum" : true
    };
	// output : 6
```

## FAQ

### How to chain the same action

just add #

```javascript
	var stylesheet = {
		"default":  "123456789",
		"truncate#1": 8,
		"truncate#2": 4,
		"truncate#3": 2
	};
```

### How to use input as variable in an expression

just use `this`

```javascript
	var stylesheet = {
      "$e" : {
        "compute#1": "a / b",
        "compute#2": "round(this)",
        "cast": "number"
      }
    }

```

### How to find more examples


see unit tests : https://github.com/castorjs/node-jbj/tree/master/test

### Try it

http://castorjs.github.io/node-jbj/

# Also

* http://goessner.net/articles/jsont/
* http://stedolan.github.io/jq/
* http://danski.github.io/spahql/
* https://github.com/MaxMotovilov/adstream-js-frameworks/wiki/Jxl-usage
* http://www.jsoniq.org/

# License

[MIT](https://github.com/castorjs/node-jbj/blob/master/LICENSE)


