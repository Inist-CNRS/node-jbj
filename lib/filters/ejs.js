/*jshint node:true, laxcomma:true*/
'use strict';
/*!
 * EJS - Filters
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(exec, execmap) {
  var filters = {};

  /**
   * First element of the target `obj`.
   */

  filters.first = function(obj) {
    return exec(null, function () {
        return obj[0];
    }, "first");
  };

  /**
   * Last element of the target `obj`.
   */

  filters.last = function(obj) {
    return exec(null, function () {
        return obj[obj.length - 1];
    }, "last");
  };

  /**
   * Capitalize the first letter of the target `str`.
   */

  filters.capitalize = function(str) {
    return exec(null, function () {
        str = String(str);
        return str[0].toUpperCase() + str.substr(1, str.length);
    }, "capitalize");
  };

  /**
   * Downcase the target `str`.
   */

  filters.downcase = function(str) {
    return exec(null, function () {
        return String(str).toLowerCase();
    }, "downcase");
  };

  /**
   * Uppercase the target `str`.
   */

  filters.upcase = function(str) {
    return exec(null, function () {
        return String(str).toUpperCase();
    }, "upcase");
  };



  /**
   * Sort the target `obj`.
   */

  filters.sort = function(obj) {
    return exec(null, function () {
        if (Array.isArray(obj)) {
          return [].concat(obj).sort();
        }
        return Object.create(obj).sort();
    }, "sort");
  };

  /**
   * Sort the target `obj` by the given `prop` ascending.
   */

  filters.sortBy = filters.sort_by = function(obj, args){
    return execmap(args, function(prop) {
        var sortedObj = Object.create(obj).sort(function(a, b) {
            a = a[prop]; b = b[prop];
            if (a > b) {return 1;}
            if (a < b) {return -1;}
            return 0;
        });
        return Object.keys(sortedObj).map(function (key) {return sortedObj[key]});
    }, "sortBy");
  };

  /**
   * Size or length of the target `obj`.
   */

  filters.size = filters.length = function(obj) {
    return exec(null, function () {
        return Object.keys(obj).length;
    }, "size");
  };

  /**
   * get the max of *input*
   */
  filters.max = function(obj, args) {
    return exec(args, function(arg) {
        return Object.keys(obj).reduce(function(m, k){ return obj[k] > m ? obj[k] : m; }, -Infinity);
    }, "max");
  };

  /**
   * get the min of *input*
   */
  filters.min = function(obj, args) {
    return exec(args, function(arg) {
        return Object.keys(obj).reduce(function(m, k){ return obj[k] < m ? obj[k] : m; }, Infinity);
    }, "min");
  };

  /**
   * Add `a` and `b`.
   */

  filters.plus = function(a, args) {
    return execmap(args, function(b) {
        return Number(a) + Number(b);
    }, "plus");
  };


  /**
   * Subtract `b` from `a`.
   */

  filters.minus = function(a, args) {
    return execmap(args, function(b) {
        return Number(a) - Number(b);
    }, "minus");
  };

  /**
   * Multiply `a` by `b`.
   */

  filters.times = function(a, args) {
    return execmap(args, function(b) {
        return Number(a) * Number(b);
    }, "times");
  };

  /**
   * Divide `a` by `b`.
   */

  filters.dividedBy = filters.divided_by = function(a, args) {
    return execmap(args, function(b) {
        return Number(a) / Number(b);
    }, "dividedBy");
  };

  /**
   * Join `obj` with the given `str`.
   */

  filters.glue = filters.join = function(obj, args) {
    return exec(args, function(arg) {
        return obj.join(String(arg|| ', '));
    }, "join");
  };

  /**
   * Truncate `str` to `len`.
   */

  filters.truncate = function(str, args) {
    str = String(str);
    return execmap(args, function(len) {
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

  filters.shift = function(obj, args) {
    return execmap(args, function(n) {
        return Array.isArray(obj) || typeof obj === 'string' ?
        obj.slice(Number(n)) :
        n - obj;
    }, "shift");
  };


  /**
   * Truncate `str` to `n` words.
   */

  filters.truncateWords = filters.truncate_words = function(str, args) {
    str = String(str);
    return execmap(args, function(n) {
        var words = str.split(/ +/);
        return words.slice(0, n).join(' ');
    }, "truncateWords");
  };

  /**
   * Replace `pattern` with `substitution` in `str`.
   */

  filters.replace = function(str, args) {
    return exec(args, function (args) {
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

  filters.prepend = function(obj, args) {
    return execmap(args, function(val) {
        return Array.isArray(obj) ?
        [val].concat(obj) :
        val + obj;
    }, "prepend");
  };

  /**
   * Append `val` to `obj`.
   */

  filters.append = function(obj, args){
    return execmap(args, function(val) {
        return Array.isArray(obj) ?
        obj.concat(val) :
        obj + val;
    }, "append");
  };

  /**
   * Map the given `prop`.
   */

  // filters.map = function(arr, prop){
  // return arr.map(function(obj){
  // return obj[prop];
  // });
  // };

  /**
   * Reverse the given `obj`.
   */

  filters.reverse = function(obj) {
    return exec(null, function () {
        return Array.isArray(obj) ?
        obj.reverse() :
        String(obj).split('').reverse().join('');
    }, "reverse");
  };


  filters.flatten = function flatten(obj) {
    return exec(null, function () {
        return Array.isArray(obj) ?
        obj.reduce(function (arr, val) {
            return arr.concat(Array.isArray(val) ? flatten(val) : val);
        }, []) :
        obj;
    }, "flatten");
  };

  filters.dedupe = filters.deduplicate = filters.unique = function(obj) {
    return exec(null, function () {
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

  filters.remove = filters.del = function(obj, arg) {
    return exec(arg, function (arg) {
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

  filters.sum = filters.total = function (obj) {
    return exec(null, function () {
        if (!Array.isArray(obj)) {
          return new Error('Input object should be an array');
        }
        var out = obj.reduce(function (prev, current) {
            return prev + Number(current);
        }, 0);
        return out;
    }, "sum");
  };




  return filters;


}
