/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('asynchronous find', function () {
  var input = {
    "a" : {
      "b" : {
        "c" : "value"
      },
      "d" : null
    }
  };

  it('find #1', function(done) {
    var stylesheet = {
      "find" : "a.b.c"
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'value');
      done(err);
    });
  });

  it('find #2', function(done) {
    var stylesheet = {
      "find" : "a",
      "find#1" : "b.c"
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'value');
      done(err);
    });
  });

  it('find #3', function(done) {
    var stylesheet = {
      "find#0" : "a",
      "find#1" : "b",
      "find#2" : "c"
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'value');
      done(err);
    });
  });

  it('find #4', function(done) {
    var stylesheet = {
      "find" : ["x", "x.y", "a.b.c"],
      "coalesce" : null
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'value');
      done(err);
    });
  });

  it('find #5', function(done) {
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
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.x.z, 'VALUE');
      done(err);
    });
  });

});
