
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('template', function () {
  var input = {
    "a" : {
      "b" : {
        "c" : "1"
      },
      "d" : "2",
      "e" : "4"
    },
    "f": "8"
  };

  it('template #1', function() {
    var stylesheet = {
      "$a" : {
        "template": "X{{a.b.c}}X{{a.d}}X{{a.e}}X{{f}}",
      }
    };
    var output = JBJ.render(stylesheet, input);
    assert.equal(output.a, "X1X2X4X8");
  });


});
