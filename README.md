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

```
Output:

	123

### renderSync(stylesheet : Object, input : Mixed) : Object

Render `input` with `stylesheet`.
```javascript
	var JBJ = require('jbj'),
	out = JBJ.renderSync({ "truncate" : 3 }, "1234");

	console.log(out);
```
Output:

	123


## Source

Stylesheet can contains an reference to data source. Source can be a file or URL.


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

Variable can be set using $ plus an dot notation path.

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


## Actions

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

### default: value
Fix value if *input* is not set
```javascript
	var stylesheet = {
		var stylesheet = {
			"default": "value"
		};
	};
```

### debug: none
Print *input* with console.log
```javascript
	var stylesheet = {
		"set": "value",
		"debug": true
	};
	// output: value
```

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

### cast: (number|string|boolean) | [(string|date), pattern]
Convert *input* to specific type
```javascript
	var stylesheet1 = {
		"set" : "1"
		"cast": number
	};
	// output : 1
	var stylesheet2 = {
		"set" : 1
		"cast": string
	};
```
for syntax see [transtype](https://github.com/touv/transtype)


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

### csv: separator
Packs *input* to CSV, return string
```javascript
	var stylesheet = {
		"set" : ["x","y","z"],
		"csv" : ","
	};
	// output : "x,y,z"\r\n
```

### parseCSV: separator
*aliases : fromCSV, uncsv*
Parse *input* as CSV string, return array
```javascript
	var stylesheet = {
		"set" : "x,y,z",
		"parseCSV": ",",
	};
	// output : ["x","y","z"]
```

### json: none
Packs *input* to JSON, return string
```javascript
	var stylesheet = {
		"set" : ["x","y","z"],
		"json": true
	};
	// output : "[\"x\",\"y\",\"z\"]"
```

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

### xml: options
Packs *input* to XML, return string
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

### coalesce:
Get the first non-undefined value
```javascript
	var stylesheet = {
		"set" : [null, undefined, null, "a", "b"],
		"coalesce": true
	};
	// output : "a"
```

### required: none
If *input* is not set, return Error

### trim: none
Trim *input*, return string
```javascript
	var stylesheet = {
		"set" : "    xxx    ",
		"trim: true
	};
	// output : "xxx"
```

### template:  mustache_templatee
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

### compute: expression
*aliases : expr*
Compute an expression with all variable of the *input*.
Note : "this" variable contains *input*
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

### capitalize:
Capitalize the first letter of *input*
```javascript
	var stylesheet = {
		"set" : "xyz",
		"capitalize": true
	};
	// output : "Xyz"
```

### downcase:
Downcase *input*
```javascript
	var stylesheet = {
		"set" : "XYZ",
		"downcase": true
	};
	// output : "xyz"
```

### upcase:
Uppercase *input*
```javascript
	var stylesheet = {
		"set" : "xyz",
		"upcase": true
	};
	// output : "XYZ"
```

### first:
Get the first element of *input*
```javascript
	var stylesheet = {
		"set" : ["a", "b", "c"],
		"first": true
	};
	// output : "a"
```

### last:
Get the last element of *input*
```javascript
	var stylesheet = {
		"set" : ["a", "b", "c"],
		"last": true
	};
	// output : "c"
```

### sort:
Sort *input* object

### sortBy:
*aliases : sort_by*
Sort *input* object the given `prop` ascending.

### size:
*aliases : length*
Get the size or the length of *input*
```javascript
	var stylesheet1 = {
		"set" : "12345"
		"size": true
	};
	var stylesheet2 = {
		"set" : [1,2,3,4,5]
		"size": true
	};
	// output : 5
```

### plus: value
Add *input* and *value*
```javascript
	var stylesheet = {
		"set" : 4
		"plus": 3
	};
	// output : 7
```

### minus: value
Subtract *value* from *input*
```javascript
	var stylesheet = {
		"set" : 4,
		"minus": 3
	};
	// output : 1
```

### times: value
Multiply *input* by *value*"
```javascript
	var stylesheet = {
		"set" : 5,
		"times": 5
	};
	// output : 25
```

### dividedBy: value
*aliases : divided_by*
Divide *input* by *value*"
```javascript
	var stylesheet = {
		"set" : 10,
		"dividedBy: 2
	};
	// output : 5
```

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

### shift: n
Shift *input* to the left by *n*
```javascript
	var stylesheet = {
		"set" : "The world"
		"shift": 4
	};
	// output : "world"
```

### truncate: length
Truncate *input* to *length*.
```javascript
	var stylesheet = {
		"set" : "hello world"
		"truncate": 5
	};
	// output : "hello"
```

### truncateWords: n
*aliases : truncate_words*
Truncate *input* to *n* words.

### replace: [pattern, substitution] | pattern
Replace *pattern* with *substitution* in *input*.
```javascript
	var stylesheet = {
		"set" : "XoXoXoX",
		"replace": ["o", "."]
	};
	// output :  X.X.X.X
```

### prepend: something
Prepend *something* to *input*
```javascript
	var stylesheet = {
		"set" : "world"
		"prepend": "hello"
	};
	// output : "hello world"
```

### append: something
Append *something* to *input*
```javascript
	var stylesheet = {
		"set" : "cool",
		"append": "!"
	};
	// output : "cool!"
```

### reverse:
Reverse items order of *input*
```javascript
	var stylesheet = {
		"set" : [1,2,3]
	};
	// output : [3,2,1]
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

just use this

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

# Also

* http://goessner.net/articles/jsont/
* http://stedolan.github.io/jq/
* http://danski.github.io/spahql/
* https://github.com/MaxMotovilov/adstream-js-frameworks/wiki/Jxl-usage
* http://www.jsoniq.org/

# License

[MIT](https://github.com/castorjs/node-jbj/blob/master/LICENSE)


