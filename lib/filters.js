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
function execargs(args, func) {
  try {
    return func(args);
  }
  catch(e) {
    return e;
  }
}

function mapargs(args, func) {
  if (Array.isArray(args)) {
    return args.map(function(i) {
      try {
        return func(i);
      }
      catch(e) {
        return e;
      }
    }).filter(function(i) {
      return (i !== '' && i !== undefined && i !== null);
    });
  }
  else {
    return execargs(args, func);
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
 */
exports.mapping = function (input, arg) {
  return arg[input] ? arg[input] : input;
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
  });
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
  });
};


/**
 * Convert input to 'number' or 'string' (optional regex pattern) or 'boolean' or 'date' with pattern)
 */
exports.cast = function(obj, args) {
  var ttype = require('transtype');
  if (Array.isArray(args)) {
    return execargs(args, function(arg) {
      return ttype(arg[0], obj, arg[1]);
    });
  }
  else {
    return execargs(args, function(arg) {
      return ttype(arg, obj);
    });
  }
};

/**
 *  selecting specific parts of input, hiding the rest.
 */
exports.mask = function(obj, args) {
  var mask = require('json-mask');
  return execargs(args, function(arg) {
    return mask(obj, arg);
  });
};

/**
 * Packs the given `obj` into CSVstring
 */
exports.csv = function(obj, args) {
  var CSV = require('csv-string');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    return CSV.stringify(obj, arg);
  });
};

/**
 * parse CSV string to array
 */
exports.parseCSV = exports.fromCSV = exports.uncsv = function(obj, args) {
  var CSV = require('csv-string');
  return execargs(args, function(arg) {
    assert(typeof arg === 'string');
    return CSV.parse(obj, arg).shift();
  });
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
exports.parseJSON = exports.fromJSON = exports.unjson = function(obj, args) {
  return execargs(args, function(arg) {
    return JSON.parse(obj);
  });
};

/**
 * Packs the *input* into XML string
 */
exports.xml = function(obj, args){
  return execargs(args, function(arg) {
    return require('xml-mapping').dump(obj, arg);
  });
};

/**
 * Packs the *input* into XML string
 */
exports.parseXML = exports.fromXML = exports.unxml = function(obj, args){
  return execargs(args, function(arg) {
    return require('xml-mapping').load(obj, arg);
  });
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
  });
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
  });
};


/**
 * If input is not set build an Error
 */
exports.required = function(obj, args) {
  if (obj === '' || obj === undefined || obj === null || obj.length === 0) {
    return new Error('Input object cannot be empty');
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
  });
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
  });
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
  });
};

/**
 * build a string with mustache template
 */
exports.template = function(obj, args) {
  var mustache = require('mustache');
  return mapargs(args, function(arg) {
    assert(typeof arg === 'string');
    return mustache.render(arg, obj);
  });
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
  return obj[0];
};

/**
 * Last element of the target `obj`.
 */

exports.last = function(obj) {
  return obj[obj.length - 1];
};

/**
 * Capitalize the first letter of the target `str`.
 */

exports.capitalize = function(str) {
  str = String(str);
  return str[0].toUpperCase() + str.substr(1, str.length);
};

/**
 * Downcase the target `str`.
 */

exports.downcase = function(str) {
  return String(str).toLowerCase();
};

/**
 * Uppercase the target `str`.
 */

exports.upcase = function(str) {
  return String(str).toUpperCase();
};

/**
 * Sort the target `obj`.
 */

exports.sort = function(obj) {
  return Object.create(obj).sort();
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
  });
};

/**
 * Size or length of the target `obj`.
 */

exports.size = exports.length = function(obj) {
  return Object.keys(obj).length;
};

/**
 * get the max of *input*
 */
exports.max = function(obj, args) {
  return execargs(args, function(arg) {
    return Object.keys(obj).reduce(function(m, k){ return obj[k] > m ? obj[k] : m; }, -Infinity);
  });
};

/**
 * get the min of *input*
 */
exports.min = function(obj, args) {
  return execargs(args, function(arg) {
    return Object.keys(obj).reduce(function(m, k){ return obj[k] < m ? obj[k] : m; }, Infinity);
  });
};

/**
 * Add `a` and `b`.
 */

exports.plus = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) + Number(b);
  });
};


/**
 * Subtract `b` from `a`.
 */

exports.minus = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) - Number(b);
  });
};

/**
 * Multiply `a` by `b`.
 */

exports.times = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) * Number(b);
  });
};

/**
 * Divide `a` by `b`.
 */

exports.dividedBy = exports.divided_by = function(a, args) {
  return mapargs(args, function(b) {
    return Number(a) / Number(b);
  });
};

/**
 * Join `obj` with the given `str`.
 */

exports.glue = exports.join = function(obj, args) {
  return execargs(args, function(arg) {
    return obj.join(String(arg|| ', '));
  });
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
  });
};


/**
 * Shift *input* to the left by n
 */

exports.shift = function(obj, args) {
  return mapargs(args, function(n) {
    return Array.isArray(obj) || typeof obj === 'string'
    ? obj.slice(Number(n))
    : n - obj;
  });
};


/**
 * Truncate `str` to `n` words.
 */

exports.truncateWords = exports.truncate_words = function(str, args) {
  str = String(str);
  return mapargs(args, function(n) {
    var words = str.split(/ +/);
    return words.slice(0, n).join(' ');
  });
};

/**
 * Replace `pattern` with `substitution` in `str`.
 */

exports.replace = function(str, args) {
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
};

/**
 * Prepend `val` to `obj`.
 */

exports.prepend = function(obj, args) {
  return mapargs(args, function(val) {
    return Array.isArray(obj)
    ? [val].concat(obj)
    : val + obj;
  });
};

/**
 * Append `val` to `obj`.
 */

exports.append = function(obj, args){
  return mapargs(args, function(val) {
    return Array.isArray(obj)
    ? obj.concat(val)
    : obj + val;
  });
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
  return Array.isArray(obj)
  ? obj.reverse()
  : String(obj).split('').reverse().join('');
};


exports.flatten = function flatten(obj) {
  return Array.isArray(obj)
  ? obj.reduce(function (arr, val) {
    return arr.concat(Array.isArray(val) ? flatten(val) : val);
  }, [])
  : obj;
};

exports.dedupe = exports.deduplicate = exports.unique = function(obj) {
  if (!Array.isArray(obj)) {
    return obj;
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
};

exports.remove = exports.del = exports.unique = function(obj, arg) {
  if (!Array.isArray(obj)) {
    return obj;
  }
  var out = [];
  obj.forEach(function (e) {
    if (e !== arg) {
      out.push(e);
    }
  });
  return out;
};

exports.sum = exports.total = function (obj) {
  if (!Array.isArray(obj)) {
    return new Error('Input object should be an array');
  }
  var out = obj.reduce(function (prev, current) {
    return prev + Number(current);
  }, 0);
  return out;
};
