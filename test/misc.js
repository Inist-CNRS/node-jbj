/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('misc', function () {

  var input = {
    "a" : {
      "b" : {
        "c" : "1234"
      },
      "d" : null
    }
  };

  it('misc #1', function() {
    var stylesheet = {
      "$a" : {
        "find": "a.b.c",
        "cast" : "number"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.a, 1234);
  });

  it('misc #2', function() {
    var stylesheet = {
      "$a" : {
        "find": "a.b.d",
        "default": "truc"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.a, "truc");
  });

  it('misc #3', function() {
    var stylesheet = {
      "$a" : {
        "find": "a.b.d",
        "default": '["truc", "bidule"]',
        "unjson": null
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.a[0], "truc");
  });

  it('misc #4', function() {
    var stylesheet = {
      "$a" : {
        "find": "a.b.d",
        "required": true
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert(output.a instanceof Error);
  });

  it('misc #5', function() {
    var stylesheet = {
      "extendWith": {
        "a" : {
          "b" : {
            "cc" : "val1"
          },
          "d" : "val2"
        }
      },
    };
    var output = JBJ.renderSync(stylesheet, "val");
    assert.equal(output, "val");
  });

  it('misc #5b', function() {
    var stylesheet = {
      "extendWith": {
        "a" : {
          "b" : {
            "cc" : "val1"
          },
          "d" : "val2"
        }
      },
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.a.b.cc, "val1");
    assert.equal(output.a.d, "val2");
  });

  it('misc #6', function() {
    var stylesheet = {
      "set": {
        "a" : {
          "b" : "val1",
          "e" : "val2"
        }
      },
    };
    var output = JBJ.renderSync(stylesheet, "val");
    assert.equal(output.a.b, "val1");
    assert.equal(output.a.d, undefined);
    assert.equal(output.a.e, "val2");
  });

  it('#misc #7', function () {
    var stylesheet = {
      "set": [1,2,3],
      "sum": true
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 6);
  });

  it('#misc #7b', function () {
    var stylesheet = {
      "set": "[1,2,3]",
      "sum": true
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.toString(), "Error: Input object should be an array");
  });

});
