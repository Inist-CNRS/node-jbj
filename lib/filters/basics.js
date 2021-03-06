/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert')
  , extend = require('extend')
  , jsel = require('JSONSelect')
  , objectPath = require('object-path')
  , JBJ = require('../jbj.js')
  , eachAsync = require('each-async')
  , traverse = require('traverse')
  , filtrex = require('filtrex')
  , toSlugCase = require('to-slug-case')
  , anglicize = require("anglicize")
  , omit = require('object.omit')
  ;


module.exports = function(exec, execmap) {
  var filters = {};

  /**
   * fetch data from URL
   */
  filters.fetchURL = filters.fetch = filters['$?'] = function (input, args, next) {
    return exec(args, function(arg) {
      if (typeof arg === 'string') {
        JBJ.fetch(arg, next);
      }
      else if (typeof input === 'string' || typeof input === 'object') {
        JBJ.fetch(input, next);
      }
      else {
        next(new Error('No URL specified'));
      }
    }, "fetchURL");
  };


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
  filters.timer = function (input, arg, next) {
    setTimeout(function() {
        next(null, input);
    }, Number.isNaN(Number(arg)) ? 0 : Number(arg));
  };



  /**
   * fix key/values if they are not present in input object
   */
  filters.expect = function (input, arg) {
    return exec(arg, function(arg) {
      assert.equal(typeof arg, 'object');
      var newObject = {}
      assert(typeof input === 'object' || !input);
      extend(true, newObject, arg, input);
      return newObject;
    }, "expect");
  };

  /**
   * add a key/value to input object
   */
  filters.add = function (input, arg) {
    return exec(arg, function(arg) {
      assert.equal(typeof input, 'object');
      assert(Array.isArray(arg));
      assert.equal(arg.length, 2);
      var key = arg[0];
      var value = arg[1];
      input[key] = value;
      return input;
    }, "add");
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
    eachAsync(Object.keys(obj), function (key, index, done) {
        JBJ.render(args, obj[key], function(err, res) {
            obj[key] = res;
            done();
        });
      }, function (error) {
        next(null, obj);
    });
  };

  /**
   * peck element(s) with "CSS selector"
   */
  filters.select = function(obj, args) {
    return execmap(args, function(arg) {
      assert.equal(typeof arg, 'string');
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
   * omit specific parts of input, showing the
   *
   * @param  {JSON} obj  input
   * @param  {String|Array} args paths to omit
   */
  filters.omit = function(obj, args) {
    if (typeof args === 'string') {
      args = args.split(',');
    }
    return omit(obj, args);
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
    return exec(args, function(arg) {
      assert.equal(typeof arg, 'string');
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
    return exec(args, function(arg) {
      assert.equal(typeof arg, 'string');
        var env = {
          "this" : obj
        };
        extend(env, obj);
        return (!Boolean(filtrex(arg)(env)));
    }, "breakIf");
  };

  /**
   * compute an expression
   */
  filters.compute = function(obj, args) {
    return exec(args, function(arg) {
      assert.equal(typeof arg, 'string');
        var env = {
          "this" : obj
        };
        extend(env, obj);
        return filtrex(arg)(env);
    }, "compute");
  };

  /**
   * inject JBJ stylesheet in a new object
   */
  filters.inject = function(obj, arg, next) {
    JBJ.inject(arg, obj, next);
  }

   /**
   * render JBJ stylesheet in a new object
   */
  filters.render = function(obj, arg, next) {
    JBJ.render(arg, obj, next);
  }


  /**
   * Convert a string to something valid in an URI.
   * See https://tools.ietf.org/html/rfc3986
   *
   * @param  {String} str Any string
   * @return {String}     slugified string
   */
  filters.slug = function(str) {
    return exec(null, function () {
       return toSlugCase(anglicize(str));
    }, "slug");
  };


  return filters;
}
