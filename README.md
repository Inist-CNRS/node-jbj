# JbJ : transfomr Json By Json

Parse and Stringify for CSV strings. It's like JSON object but for CSV. It can also work row by row.
And, if can parse strings, it can be use to parse files or streams too.

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
### last:
### sort:
### sort_by:
### size:
### plus:
### minus:
### times:
### divided_by:
### join:
### truncate:
### truncate_words:
### replace:
### prepend:
### append:
### reverse:


# Also

* http://goessner.net/articles/jsont/
* http://stedolan.github.io/jq/
* http://danski.github.io/spahql/
* https://github.com/MaxMotovilov/adstream-js-frameworks/wiki/Jxl-usage
* http://www.jsoniq.org/

# License

[MIT/X11](https://github.com/castorjs/node-jbj/blob/master/LICENSE)


