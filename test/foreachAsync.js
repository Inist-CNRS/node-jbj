/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('asynchronous foreach', function () {

  it('foreach object', function(done) {
    var input = {
      "a" : {
        "b" : "x",
        "c" : "y",
        "d" : "z"
      }
    };
    var stylesheet = {
      "path" : "a",
      "foreach" : {
        "upcase" : null
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.b, 'X');
      assert.equal(output.c, 'Y');
      assert.equal(output.d, 'Z');
      done(err);
    });
  });

  it('foreach array', function(done) {
    var input = {
      "a" : [
        { "b" : "x" },
        { "b" : "y" },
        { "b" : "z" }
      ]
    };
    var stylesheet = {
      "path" : "a",
      "foreach" : {
        "find": "b",
        "upcase" : null
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output[0], 'X');
      assert.equal(output[1], 'Y');
      assert.equal(output[2], 'Z');
      done(err);
    });
  });

  it('foreach & apply in array', function(done) {
    var input = {
      "a" : [
        { "b" : "x", "c" : 0 },
        { "b" : "y", "c" : 1 },
        { "b" : "z", "c" : 2 }
      ]
    };
    var stylesheet = {
      "path" : "a",
      "foreach" : {
        "$b" : {
          "find": "b",
          "upcase" : null
        }
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output[0].b, 'X');
      assert.equal(output[1].b, 'Y');
      assert.equal(output[2].b, 'Z');

      assert.equal(output[0].c, 0);
      assert.equal(output[1].c, 1);
      assert.equal(output[2].c, 2);
      done(err);
    });
  });

});
