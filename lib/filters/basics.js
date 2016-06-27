/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert')
  , extend = require('extend')
  , jsel = require('JSONSelect')
  , objectPath = require('object-path')
  , JBJ = require('../jbj.js')
  , eachAsync = require('each-async')
  , traverse = require('traverse')
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
      else if (typeof obj === 'string') {
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
  filters.debug = function (input, arg, next) {
    setTimeout(function() {
        next(null, input);
    }, Number.isNaN(Number(arg)) ? 0 : Number(arg));
  };



  /**
   * fix key/values if they are not present in input object
   */
  filters.expect = function (input, arg) {
    return exec(arg, function(arg) {
      assert(typeof arg === 'object');
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
      assert(typeof input === 'object');
      assert(Array.isArray(arg));
      assert(arg.length === 2);
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

  /**
   * inject JBJ stylesheet in a new object
   */
  filters.inject = function(obj, arg, next) {
    var paths = []
      , nobj = require('clone')(arg)
      ;
    traverse(nobj).forEach(function (x) {
      if (this.key !== undefined && this.key.slice(-1) === '<') {
        paths.push(this.path);
      }
    });
    eachAsync(paths,
      function(item, index, done) {
        JBJ.render(traverse(nobj).get(item), obj, function(err, out) {
          if (!err) {
            item[item.length - 1] = item[item.length - 1].slice(0, -1)
            traverse(nobj).set(item, out);
          }
          done(err, true)
        });
      }, function(error) {
        traverse(nobj).forEach(function (x) {
          if (this.key !== undefined && this.key.slice(-1) === '<') {
            this.delete()
          }
        });
        next(error, nobj);
      });
    }

  return filters;
}
