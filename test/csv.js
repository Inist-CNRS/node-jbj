/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('csv', function () {
  var input = {
    "a" : {
      "b" : ["x","y","z"],
      "d" : null
    }
  };

  it('csv #1', function() {
    var stylesheet = {
      "$e" : {
        "find#0": "a",
        "mask": "b",
        "find#1": "b",
        "csv" : ",",
        "trim": true
      }
    };
    var output = JBJ.render(stylesheet, input);
    assert.equal(output.e, "x,y,z");
  });

});
