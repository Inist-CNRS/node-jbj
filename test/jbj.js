/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('JBJ', function () {
  /* */
  describe('bad args', function () {
    it('send string', function() {
      var output = JBJ.render({}, 'test');
      assert.equal(output, 'test');
    });
    it('with no stylesheet', function() {
      var output = JBJ.render(null, 'test');
      assert.equal(output, 'test');
    });

  })
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
      var output = JBJ.render(stylesheet, input);
      assert.equal(output, 'value');
    });
    it('find #2', function() {
      var stylesheet = {
        "find" : "a",
        "find#1" : "b.c"
      };
      var output = JBJ.render(stylesheet, input);
      assert.equal(output, 'value');
    });
    it('find #3', function() {
      var stylesheet = {
        "find#0" : "a",
        "find#1" : "b",
        "find#2" : "c"
      };
      var output = JBJ.render(stylesheet, input);
      assert.equal(output, 'value');
    });



  });
/* */
});
