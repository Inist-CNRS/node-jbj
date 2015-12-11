/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert')
  , extend = require('extend')
  , jsel = require('JSONSelect')
  , objectPath = require('object-path')
  ;


module.exports = function(exec, execmap) {
  var filters = {};


  /**
   * print input
   */
  filters.debug = function (input, arg) {
    console.log('debug', input);
    return input;
  };


  /**
   * timer
   */
  filters.debug = function (input, arg, next) {
    setTimeout(function() {
        next(null, input);
    }, Number.isNaN(Number(arg)) ? 0 : Number(arg));
  };



  /**
   * fix value if input is not set
   */
  filters.default = function (input, arg) {
    return (typeof input !== 'undefined' && (input || typeof input === 'number')) ? input : arg;
  };

  /**
   * extend input with args
   */
  filters.extendWith = filters.extend = function (input, arg) {
    if (typeof input === 'object' && typeof arg === 'object') {
      extend(true, input, arg);
    }
    return input;
  };

  /**
   * set input with args (and ignore input)
   */
  filters.set = function (input, arg) {
    return arg;
  };

  /**
   * peck element(s) with "dot notation"
   */
  filters.get = filters.find = filters.path = function(obj, args) {
    return execmap(args, function(arg) {
        return objectPath.get(obj, arg);
    }, "get");
  };

  /**
   * apply filters on input
   */
  filters.foreach = function(obj, args, next) {
    var jbj = require('../jbj.js');
    var eachAsync = require('each-async');

    eachAsync(Object.keys(obj), function (key, index, done) {
        console.log('key', key);
        jbj.render(args, obj[key], function(err, res) {
            obj[key] = res;
            done();
        });
      }, function (error) {
        console.log('res', obj);
        next(null, obj);
    });
  };

  /**
   * peck element(s) with "CSS selector"
   */
  filters.select = function(obj, args) {
    return execmap(args, function(arg) {
        assert(typeof arg === 'string');
        return jsel.match(arg, obj);
    }, "select");
  };


  /**
   * Convert input to 'number' or 'string' (optional regex pattern) or 'boolean' or 'date' with pattern)
   */
  filters.cast = function(obj, args) {
    var ttype = require('transtype');
    if (Array.isArray(args)) {
      return exec(args, function(arg) {
          return ttype(arg[0], obj, arg[1]);
      }, "cast");
    }
    else {
      return exec(args, function(arg) {
          return ttype(arg, obj);
      }, "cast");
    }
  };

  /**
   *  selecting specific parts of input, hiding the rest.
   */
  filters.mask = function(obj, args) {
    var mask = require('json-mask');
    return exec(args, function(arg) {
        return mask(obj, arg);
    }, "mask");
  };

  /**
   * trim string
   */
  filters.trim = function(obj, args) {
    return exec(args, function(arg) {
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
  filters.required = function(obj, args) {
    if (obj === '' || obj === undefined || obj === null || obj.length === 0) {
      return new Error('Input object cannot be empty (required)');
    }
    else {
      return obj;
    }
  };

  /**
   * continue or not the feed
   */
  filters.assert = function(obj, args) {
    var filtrex = require('filtrex');
    return exec(args, function(arg) {
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
  filters.breakIf =  filters.breakIF =  filters.breakif = function(obj, args) {
    var filtrex = require('filtrex');
    return exec(args, function(arg) {
        assert(typeof arg === 'string');
        var env = {
          "this" : obj
        };
        extend(env, obj);
        return (!Boolean(filtrex(arg)(env)));
    }, "breakIf");
  };



  return filters;
}
