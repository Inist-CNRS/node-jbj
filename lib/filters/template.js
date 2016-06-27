/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert')
  , extend = require('extend')
  , filtrex = require('filtrex')
  , mustache = require('mustache')
  , hogan = require("hogan.js")
  , hoganCompiled = {}
  , JBJ = require('../jbj.js')
  ;


module.exports = function(exec, execmap) {
  var filters = {};

  /**
   * compute an expression
   */
  filters.compute = function(obj, args) {
    return exec(args, function(arg) {
      assert(typeof arg === 'string');
      var env = {
        "this" : obj
      };
      extend(env, obj);
      return filtrex(arg)(env);
    }, "compute");
  };


  /**
   * build a string with mustache template
   */
  filters.template = function(obj, args) {
    return exec(args, function(arg) {
      assert(typeof arg === 'string');
      return hogan.compile(arg).render(obj)
    }, "template");
  };

  /**
   * build a string with mustache template
   */
  filters.templateURL = filters.templateFile = function(obj, args, next) {
    return exec(args, function(arg) {
      assert(typeof arg === 'string');
      JBJ.fetch(arg, function (err, content) {
        if (err) {
          next(err);
        }
        else {
          if (hoganCompiled[arg] === undefined) {
            hoganCompiled[arg] = hogan.compile(content);
          }
          next(null, hoganCompiled[arg].render(obj));
        }
      })
    }, "templateURL");
  };


  return filters;
}
