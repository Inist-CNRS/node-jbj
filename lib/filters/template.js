/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert');


module.exports = function(exec, execmap) {
  var filters = {};

  /**
   * compute an expression
   */
  filters.compute = function(obj, args) {
    var extend = require('extend');
    var filtrex = require('filtrex');
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
    var mustache = require('mustache');
    return execmap(args, function(arg) {
        assert(typeof arg === 'string');
        return mustache.render(arg, obj);
    }, "template");
  };


  return filters;
}
