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


### get: path | [path,path, ...]
*aliases : find , path*
Get value in *input* with some paths

### set: value
Set value and ignore *input*

### default: value
Fix value if *input* is not set

### debug: none
Print *input* with console.log

### foreach: stylesheet
Apply stylesheet on all elements of *input*

### extend: object
*aliases : extendWith*
Extend *input* with another object

### select: path | [path,path, ...]
Peck element(s) in *input* with "CSS selector"

### cast: (number|string|boolean) | [(string|date), pattern]
Convert *input* to specific type

### mask: pattern
for syntax see [json-mask](https://github.com/nemtsov/json-mask)
Selecting specific parts of *input*, hiding the rest, return object

### csv: separator
Packs *input* to CSV, return string

### parseCSV: separator
*aliases : fromCSV, uncsv*
Parse *input* as CSV string, return array

### json: none
Packs *input* to JSON, return string

### parseJSON:
*aliases : fromJSON, unjson*
Parse *input* as JSON string, return object

### xml: options
Packs *input* to XML, return string
*options* are detailed in the [xml-mapping](https://github.com/touv/node-xml-mapping#options-1) documentation

### parseXML: options
*aliases : fromXML, unxml*
Parse *input* as XML string, return object
*options* are detailed in the [xml-mapping](https://github.com/touv/node-xml-mapping#options) documentation

### coalesce:

### required: none
If *input* is not set, return Error

### trim: none
Trim *input*, return string

### template:  mustache_templatee
Build a string with mustache template and *input*

### compute: expression
*aliases : expr*
Compute an expression with all variable of the *input*.
Note : "this" variable contains *input*

### capitalize:
Capitalize the first letter of *input*

### downcase:
Downcase *input*

### upcase:
Uppercase *input*

### first:
Get the first element of *input*

### last:
Get the last element of *input*

### sort:
Sort *input* object

### sortBy:
*aliases : sort_by*
Sort *input* object the given `prop` ascending.

### size:
*aliases : length*
Get the size or the length of *input*

### plus: value
Add *input* and *value*

### minus: value
Subtract *value* from *input*

### times: value
Multiply *input* by *value*"

### dividedBy: value
*aliases : divided_by*
Divide *input* by *value*"

### join: string = ', '
*aliases : glue*
Join *input* with the given *string*.

### shift: n
Shift *input* to the left by *n*

### truncate: length
Truncate *input* to *length*.

### truncateWords: n
*aliases : truncate_words*
Truncate *input* to *n* words.

### replace: [pattern, substitution] | pattern
Replace *pattern* with *substitution* in *input*.

### prepend: something
Prepend *something* to *input*

### append: something
Append *something* to *input*

### reverse:
Reverse items order of *input*

## FAQ

### How to chain the same action

just add #

```javascript
	var styleshhet = {
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


