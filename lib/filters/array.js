/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert');


module.exports = function(exec, execmap) {
  var filters = {};

  /**
   * translate *input* with its equivalent in *arg*
   * @param {string|array} input An array or a string to map
   * @param {Array|Object} arg   An array of values or a hash.
   * @return {string|array} the mapped input
   */
  filters.mapping = function (input, arg) {
    return exec(arg, function (arg) {
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
  filters.mappingVar = filters.combine = function (obj, arg) {
    return exec(arg, function (arg) {
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
        return filters.mapping(input, arg2);
    }, "mappingVar");
  };

  /**
   * join two arrays
   * @param  {object} obj current environment
   * @param  {Array}  arg arguments : [ "array1", "array2" ] (variable names)
   * @return {Array}      the joined arrays
   */
  filters.zip = function (obj, arg) {
    return exec(arg, function (arg) {
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
  filters.array2object = function (obj, arg) {
    return exec(arg, function (arg) {
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
  filters.arrayOfArrays2arrayOfObjects =
  filters.arrays2objects = function (obj, arg) {
    return exec(arg, function (arg) {
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
   * coalesce array
   */
  filters.coalesce = function(obj, args) {
    return exec(args, function(arg) {
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



  filters.substring = filters.substr = function (obj, arg) {
    return exec(arg, function (arg) {
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
  filters.getproperty = filters.getIndex = filters.getindex = filters.getProperty =
  function getProperty(obj, arg) {
    return exec(arg, function(arg) {
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
  filters.getpropertyvar = filters.getindexvar = filters.getIndexVar = filters.getPropertyVar =
  function getPropertyVar(obj, arg) {
    return exec(arg, function (arg) {
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

  return filters;
}
