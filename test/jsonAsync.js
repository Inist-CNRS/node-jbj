/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

JBJ.use(require('../lib/filters/parse.js'));

describe('asynchronous json', function () {

  var input = {
    "a" : {
      "b" : ["x","y","z"],
      "d" : null
    }
  };

  it('json #1', function(done) {
    var stylesheet = {
      "$e" : {
        "find#0": "a",
        "mask": "b",
        "find#1": "b",
        "json" : ",",
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.e, "[\"x\",\"y\",\"z\"]");
      done(err);
    });
  });

 it('json #2', function(done) {
    var stylesheet = {
      "find": "a.b",
      "json" : true,
      "parseJSON": true
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output[0], "x");
      assert.equal(output[1], "y");
      assert.equal(output[2], "z");
      done(err);
    });
  });

});
