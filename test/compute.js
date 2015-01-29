
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('compute', function () {
  var input = {
    "a" : 20,
    "b" : 3,
    "c" : 5,
    "d" : 8
  };

  it('#1', function() {
    var stylesheet = {
      "$e" : {
        "compute": "round(a / b)",
        "cast": "number"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.e, 7);
  });

  it('#2', function() {
    var stylesheet = {
      "$e" : {
        "compute#1": "a / b",
        "compute#2": "round(this)",
        "cast": "number"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.e, 7);
  });


});
