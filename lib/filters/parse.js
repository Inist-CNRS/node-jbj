/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert');


module.exports = function(exec, execmap) {
  var filters = {};

  /**
   * Packs the given `obj` into CSVstring
   */
  filters.csv = function(obj, args) {
    var CSV = require('csv-string');
    return exec(args, function(arg) {
        assert(typeof arg === 'string');
        return CSV.stringify(obj, arg);
    }, "csv");
  };

  /**
   * parse CSV string to array
   */
  filters.parseCSV = filters.parseCSVField = filters.fromCSV = filters.uncsv = function(obj, args) {
    var CSV = require('csv-string');
    return exec(args, function(arg) {
        assert(typeof arg === 'string');
        return CSV.parse(obj, arg).shift();
    }, "parseCSV");
  };

  /**
   * parse CSV file content to an array of arrays
   * {String} -> [ [col1, col2, ...], [col1, col2, ...] ]
   */
  filters.parseCSVFile = filters.fromCSVFile = function(obj, args) {
    var CSV = require('csv-string');
    return exec(args, function(arg) {
        assert(typeof arg === 'string');
        return CSV.parse(obj, arg);
    }, "parseCSVFile");
  };

  /**
   * Packs the given `obj` into json string
   */
  filters.json = filters.toJSON = function(obj){
    return JSON.stringify(obj);
  };

  /**
   * parse JSON string to object
   */
  filters.parseJSON = filters.fromJSON = filters.unjson = function parseJSON(obj, args) {
    return exec(args, function(arg) {
        return JSON.parse(obj);
    }, "parseJSON");
  };

  /**
   * Packs the *input* into XML string
   */
  filters.xml = function(obj, args){
    return exec(args, function(arg) {
        return require('xml-mapping').dump(obj, arg);
    }, "xml");
  };

  /**
   * Packs the *input* into XML string
   */
  filters.parseXML = filters.fromXML = filters.unxml = function(obj, args){
    return exec(args, function(arg) {
        return require('xml-mapping').load(obj, arg);
    }, "parseXML");
  };



  return filters;
}
