/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

JBJ.filters.toto = function(obj, arg) {
  return String(obj) + String(arg) + '!';
};

describe('filters', function () {

 it('misc #1', function(done) {
    var stylesheet = {
      "set" : "titi",
      "toto": "tata"
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 'tititata!');
      done(err);
    });
  });

});
