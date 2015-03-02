/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('asynchronous error', function () {

  var input = {
    "a" : {
      "b" : {
        "c" : "1234"
      },
      "d" : null
    }
  };

  it('error #1', function(done) {
    var stylesheet = {
      "$a" : {
        "default" : "\"xxxx",
        "parseJSON" : true
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a.name, 'SyntaxError');
      done(err);
    });

  });

});
