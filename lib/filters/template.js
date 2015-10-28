/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert')
  , extend = require('extend')
  , filtrex = require('filtrex')
  , mustache = require('mustache')
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
    return execmap(args, function(arg) {
        assert(typeof arg === 'string');
        return mustache.render(arg, obj);
    }, "template");
  };


  return filters;
}
