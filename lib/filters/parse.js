/*jshint node:true, laxcomma:true*/
'use strict';
var assert = require('assert')
  , CSV = require('csv-string')
  , XML = require('xml-mapping')
  , URL = require('url')
  , QueryString = require('qs')
  ;


module.exports = function(exec, execmap) {
  var filters = {};

  /**
   * Packs the given `obj` into CSVstring
   */
  filters.csv = function(obj, args) {
    assert(typeof obj === 'object');
    assert(typeof args === 'string');
    return CSV.stringify(obj, args);
  };

  /**
   * parse CSV string to array
   */
  filters.parseCSV = filters.parseCSVField = filters.fromCSV = filters.uncsv = function(obj, args) {
    assert(typeof obj === 'string');
    assert(typeof args === 'string');
    return CSV.parse(obj, args).shift();
  };

  /**
   * parse CSV file content to an array of arrays
   * {String} -> [ [col1, col2, ...], [col1, col2, ...] ]
   */
  filters.parseCSVFile = filters.fromCSVFile = function(obj, args) {
    assert(typeof obj === 'object');
    assert(typeof args === 'string');
    return CSV.parse(obj, args);
  };

  /**
   * Packs the given `obj` into json string
   */
  filters.json = filters.toJSON = function(obj){
    assert(typeof obj === 'object');
    return JSON.stringify(obj);
  };

  /**
   * parse JSON string to object
   */
  filters.parseJSON = filters.fromJSON = filters.unjson = function parseJSON(obj, args) {
    assert(typeof obj === 'string');
    return JSON.parse(obj);
  };

  /**
   * Packs the *input* into XML string
   */
  filters.xml = function(obj, args){
      assert(typeof obj === 'object');
      return XML.dump(obj, args);
  };

  /**
   * Packs the *input* into XML object
   */
  filters.parseXML = filters.fromXML = filters.unxml = function(obj, args){
      assert(typeof obj === 'string');
      return XML.load(obj, args);
  };


  /**
   * Packs the *input* into QueryString string
   */
  filters.querystring = function(obj, args){
    assert(typeof obj === 'object');
    return QueryString.stringify(obj);
  };

  /**
   * Packs the *input* into QueryString Object
   */
  filters.parseQueryString = filters.fromQueryString = function(obj, args){
    assert(typeof obj === 'string');
    return QueryString.parse(obj);
  };


   /**
   * Packs the *input* into URL string
   */
  filters.url = function(obj, args) {
    assert(typeof obj === 'object');
    return URL.format(obj);
  };

  /**
   * Packs the *input* into URL Object
   */
  filters.parseURL = filters.fromURL = function(obj, args){
    assert(typeof obj === 'string');
    return URL.parse(obj, true);
  };

  return filters;
}
