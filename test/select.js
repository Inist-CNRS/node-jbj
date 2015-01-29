/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('select', function () {
  var input = {
    "a" : {
      "b" : {
        "c" : "value"
      },
      "d" : null
    }
  };
  it('select #1', function() {
    var stylesheet = {
      "$$" : {
        "select" : ".a > .b > .c",
        "first": true
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output, 'value');
  });

  it('select #1b', function() {
    var stylesheet = {
      "select" : ".a > .b > .c",
      "first": true
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output, 'value');
  });

  it('select #1t', function() {
    var stylesheet = {
      "$d.e.f" : {
        "select" : ".a > .b > .c",
        "first": true
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output.d.e.f, 'value');
  });


  it('select #2', function() {
    var stylesheet = {
      "$$" : {
        "select" : ".a",
        "first": true,
        "select#1" : ".b > .c",
        "first#1": true
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output, 'value');
  });

  it('select #2b', function() {
    var stylesheet = {
      "select" : ".a",
      "first": true,
      "select#1" : ".b > .c",
      "first#1": true
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output, 'value');
  });

  it('select #2t', function() {
    var stylesheet = {
      "$d.e" : {
        "select" : ".a",
        "first": true,
        "select#1" : ".b > .c",
        "first#1": true
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output.d.e, 'value');
  });

  it('select #3', function() {
    var stylesheet = {
      "$$" : {
        "select#0" : ".a",
        "first#0": true,
        "select#1" : ".b",
        "first#1": true,
        "select#2" : ".c",
        "first#2": true
      }
    }
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output, 'value');
  });

  it('select #3b', function() {
    var stylesheet = {
      "select#0" : ".a",
      "first#0": true,
      "select#1" : ".b",
      "first#1": true,
      "select#2" : ".c",
      "first#2": true
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output, 'value');
  });

  it('select #3t', function() {
    var stylesheet = {
      "$d" : {
        "select#0" : ".a",
        "first#0": true,
        "select#1" : ".b",
        "first#1": true,
        "select#2" : ".c",
        "first#2": true
      }
    }
    var output = JBJ.renderSync(stylesheet, input);
    assert.ifError(!output)
    assert.equal(output.d, 'value');
  });

  it('select #4', function() {
    var stylesheet = {
      "default" : {
        "a" : {
          "b" : [
            { "#text" : "1" },
            { "#text" : "2" },
            { "#text" : "3" }
          ]
        }
      },
      "select" : ".a > .b .#text"
    }
    var output = JBJ.renderSync(stylesheet);
    assert.ifError(!output)
    assert.equal(output[0], '1');
    assert.equal(output[1], '2');
    assert.equal(output[2], '3');
  });

/**/
});
