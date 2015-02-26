/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('find', function () {
  var input = {
    "a" : {
      "b" : {
        "c" : "value"
      },
      "d" : null
    }
  };

  it('find #1', function() {
    var stylesheet = {
      "find" : "a.b.c"
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'value');
  });

  it('find #2', function() {
    var stylesheet = {
      "find" : "a",
      "find#1" : "b.c"
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'value');
  });

  it('find #3', function() {
    var stylesheet = {
      "find#0" : "a",
      "find#1" : "b",
      "find#2" : "c"
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'value');
  });

  it('find #4', function() {
    var stylesheet = {
      "find" : ["x", "x.y", "a.b.c"],
      "coalesce" : null
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'value');
  });

  it('find #5', function() {
    var stylesheet = {
      "$x.y" : {
        "find" : ["x.y", "a.b.c"],
        "coalesce" : null,
        "upcase" : null
      },
      "$x.z" : {
        "find" : ["x.y", "a.b.c"],
        "first" : null
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.x.z, 'VALUE');
  });
});
