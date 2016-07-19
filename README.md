# JBJ : transform Json By Json

A new way to transform JSON object with a JSON stylesheet. It's like XSL/XML but only with JSON.

### Try it online !

http://inist-cnrs.github.io/jbj-playground/

## Contributors

  * [Nicolas Thouvenin](https://github.com/touv)
  * [François Parmentier](https://github.com/parmentf)

# Installation

With [npm](http://npmjs.org) do:

    $ npm install jbj


# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ npm install
    $ npm test

# Documentation

## API

<a id="api-render"></a>
### render(stylesheet : Object, input : Mixed, callback : Function) : None

Render `input` with `stylesheet`.

```javascript
	var JBJ = require('jbj'),
	JBJ.render({ "truncate" : 3 }, "1234", function(err, out) {
			console.log(out);
	});

	// Output : 123

```

#### Variables
Variable can be set using `$` plus a dot notation path.
The set value can only be a JBJ expression (not a JSON literal).

Input:
```json
{
  "a": {
    "b": {
      "c": 1
    },
    "d": "Second"
  }
}
```

Stylesheet:
```json
{
    "$x" : {
        "get": "a.b.c"
    },
    "$y.y1.y2" : {
        "get": "a.d"
    }
}
```

Output:
```json
{
  "a": {
    "b": {
      "c": 1
    },
    "d": "Second"
  },
  "x": 1,
  "y": {
    "y1": {
      "y2": "Second"
    }
  }
}
```


<a id="api-inject"></a>
### inject(stylesheet : Object, input : Mixed, callback : Function) : None

Alertative mode to use JBJ actions. You can inject in `stylesheet` the `input`.
Injections are identified by a prefix and suffix in the key.
The prefix and the suffix are the less-than sign  `<`.
Prefix inject the result of a JBJ action in the current scope.
Suffix inject the result of a JBJ render in the current key.


```javascript
	var JBJ = require('jbj'),
	JBJ.render({ "<truncate" : 3 }, "1234", function(err, out) {
			console.log(out);
	});

	// Output : 123

```

#### prefix
```javascript
var input = {
    key : "hello"
}
var stylesheet = {
	"obj" : {
		"<get" : "key",
		upcase: true
	}
};
// output : { obj : "HELLO" }
```


#### suffix
```javascript
var input = {
    key : "hello"
}
var stylesheet = {
	"obj" : {
		"keyword<" : {
			get : "key",
   		    upcase: true
		}
	}
};
// output : { obj : { keyword : "HELLO" } }
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

### getActions() : Array

List all available actions.

```javascript
	var JBJ = require('jbj'),

	console.log(JBJ.getActions());

	// Output : ['get', 'set', 'expect' ...]

```

### getFilter(filterName : String) : Function

Get the statement function for an action name.

```javascript
	var JBJ = require('jbj'),

	var func = JBJ.getFilter('append');

	func('Hello', 'World' , function(err, output) {
	   console.log(output)
	})

	// Output : HelloWorld
```


### use(module: Function) : None

Adding filters/actions for external module. see the avaible modules here : https://www.npmjs.com/browse/keyword/jbj


```javascript
	var JBJ = require('jbj'),

	JBJ.use(require('jbj-numerical'));
	JBJ.use(require('jbj-ist'));
	JBJ.use(require('jbj-rdfa'));

```

> **Warning:** the method has change since v4.0


## Actions

A stylesheet is a JSON object where each key is an *action*.
The actions are divided into *modules* (since v4.0):

- **basics**: all the basic *actions* for JBJ ([debug](#debug), [default](#default), [extend](#extend), [set](#set), [get](#get), [add](#add), [expect](#expect), [foreach](#foreach), [select](#select), [cast](#cast), [mask](#mask), [trim](#trim), [required](#required), [assert](#assert), breakif, [inject](#inject), [render](#render), [compute](#compute))
- **ejs**: mainly the filters borrowed from [EJS](http://ejs.co/) ([first](#first), [last](#last), [capitalize](#capitalize), [downcase](#downcase), [upcase](#upcase), [slug](#slug), [sort](#sort), [sort_by](#sortby-prop--prop-prop-), [size](#size), [max](#max), [min](#min), [plus](#plus), [minus](#minus), [times](#times), [dividedBy](#dividedBy), [join](#join), [truncate](#truncate), [shift](#shift), [truncateWords](#truncateWords), [replace](#replace), [prepend](#prepend), [append](#append), [reverse](#reverse), [flatten](#flatten), [deduplicate](#deduplicate), [remove](#remove), [sum](#sum), [slug](#slug))
- [**parse**](https://github.com/Inist-CNRS/node-jbj-parse): file format conversion, through parsing ([csv](https://github.com/Inist-CNRS/node-jbj-parse#csv), [parseCSV](https://github.com/Inist-CNRS/node-jbj-parse#parsecsv), [parseCSVFile](https://github.com/Inist-CNRS/node-jbj-parse#parsecsvfile), [json](https://github.com/Inist-CNRS/node-jbj-parse#json), [parseJSON](https://github.com/Inist-CNRS/node-jbj-parse#parsejson), [xml](https://github.com/Inist-CNRS/node-jbj-parse#xml), [parseXML](https://github.com/Inist-CNRS/node-jbj-parse#parsexml))
- [**template**](https://github.com/Inist-CNRS/node-jbj-template): [template](https://github.com/Inist-CNRS/node-jbj-template#template), templateURL
- [**array**](https://github.com/Inist-CNRS/node-jbj-array): complex actions implying arrays ([mapping](https://github.com/Inist-CNRS/node-jbj-array#mapping), [mappingVar](https://github.com/Inist-CNRS/node-jbj-array#mappingvar-inputtable), [zip](https://github.com/Inist-CNRS/node-jbj-array#zip), [array2object](https://github.com/Inist-CNRS/node-jbj-array#array2object), [arrays2objects](https://github.com/Inist-CNRS/node-jbj-array#arrays2objects), [coalesce](https://github.com/Inist-CNRS/node-jbj-array#coalesce), [substring](https://github.com/Inist-CNRS/node-jbj-array#substring), [getindex](https://github.com/Inist-CNRS/node-jbj-array#getindex), [getindexvar](https://github.com/Inist-CNRS/node-jbj-array#getindexvar))
- [**rdfa**](https://github.com/Inist-CNRS/node-jbj-rdfa): generate [HTML+RDFa](https://www.w3.org/TR/xhtml-rdfa-primer/) from a [JSON-LD](http://json-ld.org/) ([getJsonLdField](https://github.com/Inist-CNRS/node-jbj-rdfa#getJsonLdField), [style](https://github.com/Inist-CNRS/node-jbj-rdfa#style), [class](https://github.com/Inist-CNRS/node-jbj-rdfa#class), [tag](https://github.com/Inist-CNRS/node-jbj-rdfa#tag), [toHtml](https://github.com/Inist-CNRS/node-jbj-rdfa#toHtml))
- [**nlp**](https://github.com/Inist-CNRS/node-jbj-nlp): natural language processing ([anglicize](https://github.com/Inist-CNRS/node-jbj-nlp#anglicize), [countCharacters](https://github.com/Inist-CNRS/node-jbj-nlp#countCharacters), [countWords](https://github.com/Inist-CNRS/node-jbj-nlp#countWords), [tokenize](https://github.com/Inist-CNRS/node-jbj-nlp#tokenize), [metaphone](https://github.com/Inist-CNRS/node-jbj-nlp#metaphone))
- [**numerical**](https://github.com/Inist-CNRS/node-jbj-numerical): numerical text processing ([floatprint](https://github.com/Inist-CNRS/node-jbj-numerical#floatprint), [loselose](https://github.com/Inist-CNRS/node-jbj-numerical#loselose), [pearson](https://github.com/Inist-CNRS/node-jbj-numerical#pearson), [sdbm](https://github.com/Inist-CNRS/node-jbj-numerical#sdbm), [fnv1a](https://github.com/Inist-CNRS/node-jbj-numerical#fnv1a), [murmur3](https://github.com/Inist-CNRS/node-jbj-numerical#murmur3), [distincter](https://github.com/Inist-CNRS/node-jbj-numerical#distincter), [reseter](https://github.com/Inist-CNRS/node-jbj-numerical#reseter))
- [**jsonld**](https://github.com/Inist-CNRS/node-jbj-jsonld): facilitate the generation of [JSON-LD](http://json-ld.org/) from JSON ([context](https://github.com/Inist-CNRS/node-jbj-jsonld#context), [jsonld](https://github.com/Inist-CNRS/node-jbj-jsonld#jsonld))

The modules you can use by defaults are `basics` and `ejs`.

To use another module, first install it via npm:
```bash
$ npm install jbj-array
```
then declare its use via:
```js
JBJ.use(require('jbj-array'));
```

> **Note:** `basics` and `ejs` modules are distributed with the `jbj` package,
> and used by default: you can use their actions without any further
> declaration. However, `parse`, `template`, and `array`, which were parts of
> the pre-3.0 versions of JBJ are now separate packages (simply add `jbj-`
> before the modules names to get their matching packages).

<a id="set"></a>
### set: value
- *module: basics*

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
### get: path | [path,path, ...]
- *module: basics*
- *aliases : find , path*

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
- *module: basics*

Fix value if *input* is not set

```javascript
	var stylesheet = {
		var stylesheet = {
			"default": "value"
		};
	};
```

<a id="fetch"></a>
### fetch
- *module: basics*
- *aliases : fetchURL, $?*

Stylesheet can contain a reference to data source. Source can be a file or an URL.
By default, only the *file:* protocol is supported. Add your own protocol with [*register*](#registerprotocol--string-callback--function--none)

```javascript
	var stylesheet_1 = {
      "fetch" : "https://raw.githubusercontent.com/castorjs/node-jbj/master/package.json",
      "$name" : {
        "upcase": true
      },
      "$main": {
        "upcase": true
      }
    };
	var stylesheet_2 = {
      "$name" : {
        "fetch" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
        "parseJSON" : true,
        "path": "name"
      },
      "$main": {
        "fetch" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
        "parseJSON" : true,
        "path": "main",
      }
    };
```



<a id="add"></a>
### add: [key, value]
- *module: basics*

Add a *key*/*value* pair into the *input* object.

```json
{
  "input": { },
  "stylesheet": {
    "add": ["tag", "span"]
  },
  "expected": {
    "tag": "span"
  }
}
```

```json
{
  "input": {
    "content": "not empty"
  },
  "stylesheet": {
    "add": ["tag", "span"]
  },
  "expected": {
    "content": "not empty",
    "tag": "span"
  }
}
```


<a id="expect"></a>
### expect: object
- *module: basics*

Set default key/values for the *input* object: when a key is not present in the *input* object, it is set the value given in the argument object.

```json
{
  "input": {
    "a": 3
  },
  "stylesheet": {
    "expect": {
      "a": 1,
      "b": 2
    }
  },
  "expected": {
    "a": 3,
    "b": 2
  }
}
```

```json
{
  "stylesheet": {
    "expect": {
      "a": 1,
      "b": 2
    }
  },
  "expected": {
    "a": 1,
    "b": 2
  }
}
```

<a id="inject"></a>
### inject:
- *module: basics*

Return a new Object with [JBJ.inject](#api-inject).

<a id="render"></a>
### render:
- *module: basics*

Return a new Object with [JBJ.render](#api-render).


<a id="compute"></a>
### compute:
- *module: basics*

Compute an expression with all variables of the *input*. Use the [filtrex](https://github.com/joewalnes/filtrex#expressions) syntax.
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



<a id="debug"></a>
### debug: none
- *module: basics*

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
- *module: basics*

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
- *module: basics*
- *aliases : extendWith*

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
- *module: basics*

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

> **Note:** `select` *always* returns an array (an empty array when nothing was selected).

<a id="cast"></a>
### cast: (number|string|boolean) | [(string|date), pattern]
- *module: basics*

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
- *module: basics*

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

For syntax see [json-mask](https://github.com/nemtsov/json-mask)

<a id="required"></a>
### required: none
- *module: basics*

If *input* is not set, return Error

<a id="trim"></a>
### trim: none
- *module: basics*

Trim *input*, return string

```javascript
	var stylesheet = {
		"set" : "    xxx    ",
		"trim": true
	};
	// output : "xxx"
```

<a id="assert"></a>
### assert: expression
- *module: basics*

If expression is true, then statements will be continued, otherwise it is stopped and  it returns null
> Note : `this` variable contains *input*

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
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*

Uppercase *input*

```javascript
	var stylesheet = {
		"set" : "xyz",
		"upcase": true
	};
	// output : "XYZ"
```

<a id="slug"></a>
### slug:
- *module: ejs*

Convert the *input* string to something valid in an URI.
See https://tools.ietf.org/html/rfc3986

```javascript
{
  "slug spaces": {
    "input": "with space",
    "stylesheet": {
      "slug": true
    },
    "expected": "with-space"
  },

  "slug lowercase": {
    "input": "IN UPPERCASE",
    "stylesheet": {
      "slug": true
    },
    "expected": "in-uppercase"
  },

  "slug diacritics": {
    "input": "En français",
    "stylesheet": {
      "slug": true
    },
    "expected": "en-francais"
  },

  "slug diacritics #2": {
    "input": "Le Cinquième Élément",
    "stylesheet": {
      "slug": true
    },
    "expected": "le-cinquieme-element"
  },

  "slug unicode": {
    "input": "i ♥ unicode",
    "stylesheet": {
      "slug": true
    },
    "expected": "i-unicode"
  }
}
```

<a id="first"></a>
### first:
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*
- *aliases : sort_by*

Sort *input* object the given `prop` ascending.


```javascript
	var stylesheet = {
		"set": [
			{ "name": "zert" },
			{ "name": "abcd" }
		],
		"sortBy": "name"
	};
	// output : [{ "name": "abcd" }, { "name": "zert" }]
```

<a id="size"></a>
### size:
- *module: ejs*
- *aliases : length*

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
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*
- *aliases : divided_by*

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
- *module: ejs*
- *aliases : glue*

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
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*
- *aliases : truncate_words*

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
- *module: ejs*

Replace *pattern* (as a regular expression) with *substitution* in *input*.

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

> **Tip:** to escape any character, use `\\` instead of just `\`. Example: use `"replace": "\\(trash\\)"` removes `(trash)` from input, whereas `"replace": "(trash)"` removes only `trash`.

<a id="prepend"></a>
### prepend: something | [something, something, ...]
- *module: ejs*

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
- *module: ejs*

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
- *module: ejs*

Reverse items order of *input*

```javascript
	var stylesheet = {
		"set" : [1,2,3]
	};
	// output : [3,2,1]
```

<a id="flatten"></a>
### flatten:
- *module: ejs*

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
- *module: ejs*
- *aliases : dedupe , unique*

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
- *module: ejs*
- *alias : del*

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

<a id="sum"></a>
### sum:
- *module: ejs*
- *alias : total*

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

# Also

* http://goessner.net/articles/jsont/
* http://stedolan.github.io/jq/
* http://danski.github.io/spahql/
* https://github.com/MaxMotovilov/adstream-js-frameworks/wiki/Jxl-usage
* http://www.jsoniq.org/

# License

[MIT](https://github.com/castorjs/node-jbj/blob/master/LICENSE)


