/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('asynchronous compute', function () {
  var input = {
    "a" : 20,
    "b" : 3,
    "c" : 5,
    "d" : 8
  };

  it('#1', function(done) {
    var stylesheet = {
      "$e" : {
        "compute": "round(a / b)",
        "cast": "number"
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.e, 7);
      done(err);
    });
  });

  it('#2', function(done) {
    var stylesheet = {
      "$e" : {
        "compute#1": "a / b",
        "compute#2": "round(this)",
        "cast": "number"
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.e, 7);
      done(err);
    });
  });

  it('#3', function(done) {
    var stylesheet = {
      "$x" : {
        "compute#1": "a / b",
        "compute#2": "round(this)",
        "cast": "number"
      },
      "$y" : {
        "path": "b",
        "cast": "number"
      },
      "$z" : {
        "compute": "x + y",
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.z, 10);
      done(err);
    });
  });

});
