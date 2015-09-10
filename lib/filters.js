/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert')
  , extend = require('extend');

/*!
 * JBJ - Filters
 * Copyright(c) 2013 Nicolas Thouvenin <nthouvenin@gmail.com>
 * MIT Licensed
 */

/**
 * wrappers
 */
function execargs(args, func, actionName) {
  try {
    return func(args);
  }
  catch(e) {
    e.message += actionName ? " (" + actionName + ")" : "";
    return e;
  }
}

function mapargs(args, func, actionName) {
  if (Array.isArray(args)) {
    return args.map(function(i) {
      try {
        return func(i);
      }
      catch(e) {
        e.message += actionName ? " (" + actionName + ")" : "";
        return e;
      }
    }).filter(function(i) {
      return (i !== '' && i !== undefined && i !== null);
    });
  }
  else {
    return execargs(args, func, actionName);
  }
}


/**
 * print input
 */
exports.debug = function (input, arg) {
  console.log('debug', input);
  return input;
};

/**
 * translate *input* with its equivalent in *arg*
 * @param {string|array} input An array or a string to map
 * @param {Array|Object} arg   An array of values or a hash.
 * @return {string|array} the mapped input
 */
exports.mapping = function (input, arg) {
  return execargs(arg, function (arg) {
    var mapElement = function (element, table) {
      return table[element] ? table[element] : element;
    };

    if (typeof input !== 'object') {
      return mapElement(input, arg);
    }
    if (Array.isArray(input)) {
      return input.map(function (element) {
        return mapElement(element, arg);
      });
    }
    return input;
  }, "mapping");
};

/**
 * translate *arg[0]* with its equivalent in *arg[1]*
 * @param  {object} obj current environment
 * @param  {Array} arg arguments : ["input", "table"]
 * @return {String|Array}     the mapped *arg[1]*
 */
exports.mappingVar = exports.combine = function (obj, arg) {
  return execargs(arg, function (arg) {
    assert(Array.isArray(arg));
    assert(typeof obj === 'object');
    assert(arg.length === 2);
    assert(typeof arg[0] === 'string');
    assert(typeof arg[1] === 'string');
    var objectPath = require('object-path');
    var input = objectPath.get(obj, arg[0]);
    var arg2  = objectPath.get(obj, arg[1]);
    assert(input);
    assert(arg2);
    return exports.mapping(input, arg2);
  }, "mappingVar");
};

/**
 * join two arrays
 * @param  {object} obj current environment
 * @param  {Array}  arg arguments : [ "array1", "array2" ] (variable names)
 * @return {Array}      the joined arrays
 */
exports.zip = function (obj, arg) {
  return execargs(arg, function (arg) {
    assert(Array.isArray(arg));
    assert(typeof obj === 'object');
    assert(arg.length == 2);
    var objectPath = require('object-path');
    var array1 = objectPath.get(obj, arg[0]);
    var array2 = objectPath.get(obj, arg[1]);
    assert(array1);
    assert(array2);
    assert(Array.isArray(array1));
    assert(Array.isArray(array2));
    return array1.map(function (e,i) {
      var o = { _id: e._id };
      o[arg[0]] = e.value;
      o[arg[1]] = array2[i].value;
      return o;
    });
  }, "zip");
};

/**
 * Convert an array into an object
 * @param  {object} obj current environment (the array)
 * @param  {Array}  arg argument:  [ "key", "value"] (default: "_id", "value")
 * @return {object}     An object where "key" are property names and "value"s are property values
 */
exports.array2object = function (obj, arg) {
  return execargs(arg, function (arg) {
    assert(typeof obj === "object");
    assert(Array.isArray(obj));
    if (!Array.isArray(arg)) {
      arg = ["_id","value"];
    }
    assert(arg.length === 2);
    var key = arg[0];
    var value = arg[1];
    var o = {};
    obj.forEach(function (item) {
      o[item[key]] = item[value];
    });
    return o;
  }, "array2object");
};

/**
 * Convert an array of arrays to an array of objects
 * @param  {object} obj current environment (the array of arrays)
 * @param  {Array}  arg argument: ["key", "value"] (default: "_id", "value")
 * @return {object}     An array of objects (with keys taken from arg)
 * @see    https://github.com/madec-project/ezvis/issues/65
 */
exports.arrayOfArrays2arrayOfObjects =
exports.arrays2objects = function (obj, arg) {
  return execargs(arg, function (arg) {
    assert(typeof obj === "object");
    assert(Array.isArray(obj));
    if (!Array.isArray(arg)) {
      arg = ["_id","value"];
    }
    assert(arg.length === 2);
    var key = arg[0];
    var value = arg[1];
    obj = obj.map(function (item) {
      var o = {};
      o[key] = item[0];
      o[value] = item[1];
      return o;
    });
    return obj;
  }, "arrays2objects");
};

/**
 * fix value if input is not set
 */
exports.default = function (input, arg) {
  return (typeof input !== 'undefined' && (input || typeof input === 'number')) ? input : arg;
};


/**
 * extend input with args
 */
exports.extendWith = exports.extend = function (input, arg) {
  if (typeof input === 'object' && typeof arg === 'object') {
    extend(true, input, arg);
  }
  return input;
};

/**
 * set input with args (and ignore input)
 */
exports.set = function (input, arg) {
  return arg;
};

/**
 * peck element(s) with "dot notation"
 */
exports.get = exports.find = exports.path = function(obj, args) {
  var objectPath = require('object-path');
  return mapargs(args, function(arg) {
    return objectPath.get(obj, arg);
  }, "get");
};

/**
 * apply filters on input
 */
exports.foreach = function(obj, args) {
  var jbj = require('./jbj.js');
  for (var i in obj) {
    if(obj.hasOwnProperty(i)) {
      obj[i] = jbj.renderSync(args, obj[i]);
    }
  }
  return obj;
};


/**
 * peck element(s) with "CSS selector"
 */
exports.select = function(obj, args) {
  var jsel = require('JSONSelect');
  return mapargs(args, function(arg) {
    assert(typeof arg === 'string');
    return jsel.match(arg, obj);
  }, "select");
};


/**
 * Convert input to 'number' or 'string' (optional regex pattern) or 'boolean' or 'date' with pattern)
 */
exports.cast = function(obj, args) {
  var ttype = require('transtype');
  if (Array.isArray(args)) {
    return execargs(args, function(arg) {
      return ttype(arg[0], obj, arg[1]);
    }, "cast");
  }
  else {
    return execargs(args, function(arg) {
      return ttype(arg, obj);
    }, "cast");
  }
};

/**
 *  selecting specific parts of input, hiding the rest.
 */
exports.mask = function(obj, args) {
  var mask = require('json-mask');
  return execargs(args, function(arg) {
    return mask(obj, arg);
  }, "mask");
};

/**
 * Packs the given `obj` into CSVstring
 */
exports.csv = function(obj, args) {
  var CSV = require('csv-string');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    return CSV.stringify(obj, arg);
  }, "csv");
};

/**
 * parse CSV string to array
 */
exports.parseCSV = exports.parseCSVField = exports.fromCSV = exports.uncsv = function(obj, args) {
  var CSV = require('csv-string');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    return CSV.parse(obj, arg).shift();
  }, "parseCSV");
};

/**
 * parse CSV file content to an array of arrays
 * {String} -> [ [col1, col2, ...], [col1, col2, ...] ]
 */
exports.parseCSVFile = exports.fromCSVFile = function(obj, args) {
  var CSV = require('csv-string');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    return CSV.parse(obj, arg);
  }, "parseCSVFile");
};

/**
 * Packs the given `obj` into json string
 */
exports.json = exports.toJSON = function(obj){
  return JSON.stringify(obj);
};

/**
 * parse JSON string to object
 */
exports.parseJSON = exports.fromJSON = exports.unjson = function parseJSON(obj, args) {
  return execargs(args, function(arg) {
    return JSON.parse(obj);
  }, "parseJSON");
};

/**
 * Packs the *input* into XML string
 */
exports.xml = function(obj, args){
  return execargs(args, function(arg) {
    return require('xml-mapping').dump(obj, arg);
  }, "xml");
};

/**
 * Packs the *input* into XML string
 */
exports.parseXML = exports.fromXML = exports.unxml = function(obj, args){
  return execargs(args, function(arg) {
    return require('xml-mapping').load(obj, arg);
  }, "parseXML");
};


/**
 * coalesce array
 */
exports.coalesce = function(obj, args) {
  return execargs(args, function(arg) {
    return obj.map(function(s) {
      if (typeof s !== 'string') {
        return s;
      }
      return s.trim();
    }).filter(function(i) {
      return (i !== '' && i !== undefined && i !== null);
    });
  }, "coalesce");
};

/**
 * trim string
 */
exports.trim = function(obj, args) {
  return execargs(args, function(arg) {
    if (typeof obj === 'string') {
      return obj.trim();
    }
    else {
      return obj;
    }
  }, "trim");
};


/**
 * If input is not set build an Error
 */
exports.required = function(obj, args) {
  if (obj === '' || obj === undefined || obj === null || obj.length === 0) {
    return new Error('Input object cannot be empty (required)');
  }
  else {
    return obj;
  }
};

/**
 * compute an expression
 */
exports.compute = function(obj, args) {
  var filtrex = require('filtrex');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    var env = {
      "this" : obj
    };
    extend(env, obj);
    return filtrex(arg)(env);
  }, "compute");
};


/**
 * continue or not the feed
 */
exports.assert = function(obj, args) {
  var filtrex = require('filtrex');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    var env = {
      "this" : obj
    };
    extend(env, obj);
    return Boolean(filtrex(arg)(env));
  }, "assert");
};

/**
 * break or not the feed
 */
exports.breakIf =  exports.breakIF =  exports.breakif = function(obj, args) {
  var filtrex = require('filtrex');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    var env = {
      "this" : obj
    };
    extend(env, obj);
    return (!Boolean(filtrex(arg)(env)));
  }, "breakIf");
};

/**
 * build a string with mustache template
 */
exports.template = function(obj, args) {
  var mustache = require('mustache');
  return mapargs(args, function(arg) {
    assert(typeof arg === 'string');
    return mustache.render(arg, obj);
  }, "template");
};


/*!
 * EJS - Filters
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * First element of the target `obj`.
 */

exports.first = function(obj) {
  return execargs(null, function () {
    return obj[0];
  }, "first");
};

/**
 * Last element of the target `obj`.
 */

exports.last = function(obj) {
  return execargs(null, function () {
    return obj[obj.length - 1];
  }, "last");
};

/**
 * Capitalize the first letter of the target `str`.
 */

exports.capitalize = function(str) {
  return execargs(null, function () {
    str = String(str);
    return str[0].toUpperCase() + str.substr(1, str.length);
  }, "capitalize");
};

/**
 * Downcase the target `str`.
 */

exports.downcase = function(str) {
  return execargs(null, function () {
    return String(str).toLowerCase();
  }, "downcase");
};

/**
 * Uppercase the target `str`.
 */

exports.upcase = function(str) {
  return execargs(null, function () {
    return String(str).toUpperCase();
  }, "upcase");
};

/**
 * Sort the target `obj`.
 */

exports.sort = function(obj) {
  return execargs(null, function () {
    if (Array.isArray(obj)) {
      return [].concat(obj).sort();
    }
    return Object.create(obj).sort();
  }, "sort");
};

/**
 * Sort the target `obj` by the given `prop` ascending.
 */

exports.sortBy = exports.sort_by = function(obj, args){
  return mapargs(args, function(prop) {
    return Object.create(obj).sort(function(a, b) {
      a = a[prop]; b = b[prop];
      if (a > b) {return 1;}
      if (a < b) {return -1;}
      return 0;
    });
  }, "sortBy");
};

/**
 * Size or length of the target `obj`.
 */

exports.size = exports.length = function(obj) {
  return execargs(null, function () {
    return Object.keys(obj).length;
  }, "size");
};

/**
 * get the max of *input*
 */
exports.max = function(obj, args) {
  return execargs(args, function(arg) {
    return Object.keys(obj).reduce(function(m, k){ return obj[k] > m ? obj[k] : m; }, -Infinity);
  }, "max");
};

/**
 * get the min of *input*
 */
exports.min = function(obj, args) {
  return execargs(args, function(arg) {
    return Object.keys(obj).reduce(function(m, k){ return obj[k] < m ? obj[k] : m; }, Infinity);
  }, "min");
};

/**
 * Add `a` and `b`.
 */

exports.plus = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) + Number(b);
  }, "plus");
};


/**
 * Subtract `b` from `a`.
 */

exports.minus = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) - Number(b);
  }, "minus");
};

/**
 * Multiply `a` by `b`.
 */

exports.times = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) * Number(b);
  }, "times");
};

/**
 * Divide `a` by `b`.
 */

exports.dividedBy = exports.divided_by = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) / Number(b);
  }, "dividedBy");
};

/**
 * Join `obj` with the given `str`.
 */

exports.glue = exports.join = function(obj, args) {
  return execargs(args, function(arg) {
    return obj.join(String(arg|| ', '));
  }, "join");
};

/**
 * Truncate `str` to `len`.
 */

exports.truncate = function(str, args) {
  str = String(str);
  return mapargs(args, function(len) {
    len = Number(len);
    if (str.length > len) {
      str = str.slice(0, len);
    }
    return str;
  }, "truncate");
};


/**
 * Shift *input* to the left by n
 */

exports.shift = function(obj, args) {
  return mapargs(args, function(n) {
    return Array.isArray(obj) || typeof obj === 'string' ?
          obj.slice(Number(n)) :
          n - obj;
  }, "shift");
};


/**
 * Truncate `str` to `n` words.
 */

exports.truncateWords = exports.truncate_words = function(str, args) {
  str = String(str);
  return mapargs(args, function(n) {
    var words = str.split(/ +/);
    return words.slice(0, n).join(' ');
  }, "truncateWords");
};

/**
 * Replace `pattern` with `substitution` in `str`.
 */

exports.replace = function(str, args) {
  return execargs(args, function (args) {
    var pattern, substitution, flags;
    if (Array.isArray(args)) {
      pattern = String(args[0]);
      substitution = String(args[1] || '');
      flags = String(args[2] || 'g');
    }
    else {
      pattern = String(args);
      substitution = '';
      flags = 'g';
    }
    var search = new RegExp(pattern, flags);
    return String(str).replace(search, substitution);
  }, "replace");
};

/**
 * Prepend `val` to `obj`.
 */

exports.prepend = function(obj, args) {
  return mapargs(args, function(val) {
    return Array.isArray(obj) ?
          [val].concat(obj) :
          val + obj;
  }, "prepend");
};

/**
 * Append `val` to `obj`.
 */

exports.append = function(obj, args){
  return mapargs(args, function(val) {
    return Array.isArray(obj) ?
          obj.concat(val) :
          obj + val;
  }, "append");
};

/**
 * Map the given `prop`.
 */

// exports.map = function(arr, prop){
// return arr.map(function(obj){
// return obj[prop];
// });
// };

/**
 * Reverse the given `obj`.
 */

exports.reverse = function(obj) {
  return execargs(null, function () {
    return Array.isArray(obj) ?
          obj.reverse() :
          String(obj).split('').reverse().join('');
  }, "reverse");
};


exports.flatten = function flatten(obj) {
  return execargs(null, function () {
    return Array.isArray(obj) ?
          obj.reduce(function (arr, val) {
            return arr.concat(Array.isArray(val) ? flatten(val) : val);
          }, []) :
          obj;
  }, "flatten");
};

exports.dedupe = exports.deduplicate = exports.unique = function(obj) {
  return execargs(null, function () {
    if (!Array.isArray(obj)) {
      return new Error("The input have to be an array");
    }
    var i;
    var out = [];
    var o   = {};
    obj.forEach(function (e) {
      o[e] = e;
    });
    for (i in o) {
      out.push(o[i]);
    }
    return out;
  }, "deduplicate");
};

exports.remove = exports.del = exports.unique = function(obj, arg) {
  return execargs(arg, function (arg) {
    if (!Array.isArray(obj)) {
      return new Error('The input have to be an array');
    }
    var out = [];
    obj.forEach(function (e) {
      if (e !== arg) {
        out.push(e);
      }
    });
    return out;
  }, "remove");
};

exports.sum = exports.total = function (obj) {
  return execargs(null, function () {
    if (!Array.isArray(obj)) {
      return new Error('Input object should be an array');
    }
    var out = obj.reduce(function (prev, current) {
      return prev + Number(current);
    }, 0);
    return out;
  }, "sum");
};

exports.substring = exports.substr = function (obj, arg) {
  return execargs(arg, function (arg) {
    if (!Array.isArray(arg)) {
      return new Error("Argument should be an array");
    }
    if (!arg.length) {
      return new Error("Array argument should not be empty");
    }
    if (typeof obj !== 'string') {
      return new Error("Input object should be a string");
    }
    return obj.substr(arg[0], arg[1]||Infinity);
  }, "substring");
};

/**
 * Get a property of an object, or an item of an array.
 * @param  {object}         obj current environment (object/array)
 * @param  {String|Number}  arg the key, or the indice in the obj
 * @return {object|String|Number}  The property of the obj
 */
exports.getproperty = exports.getIndex = exports.getindex = exports.getProperty =
function getProperty(obj, arg) {
  return execargs(arg, function(arg) {
    assert(typeof obj === 'object');
    assert(typeof arg !== 'object');
    assert(!Array.isArray(arg));
    return obj[arg];
  }, "getProperty, getIndex");
};

/**
 * Get a property of an object, or an item of an array, like getproperty, but
 * using variables.
 * @param  {object} obj current environment (object/array)
 * @param  {Array}  arg array of variable names [ "object", "property"]
 * @return {object}     The property of the obj
 */
exports.getpropertyvar = exports.getindexvar = exports.getIndexVar = exports.getPropertyVar =
function getPropertyVar(obj, arg) {
  return execargs(arg, function (arg) {
    assert(typeof obj === 'object');
    assert(typeof arg === 'object');
    assert(Array.isArray(arg));
    assert(arg.length === 2);
    var objectPath = require('object-path');
    var o = objectPath.get(obj, arg[0]);
    var i = objectPath.get(obj, arg[1]);
    assert(o);
    assert(i);
    return o[i];
  }, "getPropertyVar, getIndexVar");
};
