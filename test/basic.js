
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('basic', function () {
  var input = {
    "a" : {
      "b" : {
        "c" : "value"
      },
      "d" : null
    }
  };

  it('basic #1', function() {
    var stylesheet = {
      "get": "a.b.c",
      "capitalize" : null
    };
    var output = JBJ.render(stylesheet, input);
    assert.equal(output, 'Value');
  });

  it('basic #2', function() {
    var stylesheet = {
      "get": "a.b.c",
      "upcase" : null
    };
    var output = JBJ.render(stylesheet, input);
    assert.equal(output, 'VALUE');
  });

  it('basic #3', function() {
    var stylesheet = {
      "get": "a.b.c",
      "upcase" : null,
      "downcase" : null
    };
    var output = JBJ.render(stylesheet, input);
    assert.equal(output, 'value');
  });



});
