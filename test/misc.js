
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
    var output = JBJ.render(stylesheet, input);
    assert.equal(output.a, 1234);
  });

  it('misc #2', function() {
    var stylesheet = {
      "$a" : {
        "find": "a.b.d",
        "default": "truc"
      }
    };
    var output = JBJ.render(stylesheet, input);
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
    var output = JBJ.render(stylesheet, input);
    assert.equal(output.a[0], "truc");
  });

  it('misc #4', function() {
    var stylesheet = {
      "$a" : {
        "find": "a.b.d",
        "required": true
      }
    };
    var output = JBJ.render(stylesheet, input);
    assert(output.a instanceof Error);
  });

});
