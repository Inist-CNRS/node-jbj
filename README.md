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

### renderSync(stylesheet : Object, input : Mixed) : Object

Render `input` with `stylesheet`.
```javascript
	var JBJ = require('jbj'),
	out = JBJ.renderSync({ "truncate" : 3 }, "1234");

	console.log(out);
```
Output:

	123

If separator parameter is not provided, it is automatically detected.

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

### json: none
Packs *input* to JSON, return string

### parseCSV: separator
*aliases : fromCSV, uncsv*
Parse *input* as CSV string, return array

### parsejSON:
*aliases : fromJSON, unjson*
Parse *input* as JSON string, return object

### coalesce:

### required: none
If *input* is not set, return Error

### trim: none
Trim *input*, return string

### template:  mustache_templatee
Build a string with mustache template and *input*

### compute: expression
Build a string with mustache template and *input*

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



# Also

* http://goessner.net/articles/jsont/
* http://stedolan.github.io/jq/
* http://danski.github.io/spahql/
* https://github.com/MaxMotovilov/adstream-js-frameworks/wiki/Jxl-usage
* http://www.jsoniq.org/

# License

[MIT/X11](https://github.com/castorjs/node-jbj/blob/master/LICENSE)


