/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('asynchronous mask', function () {

  var input = {
    "a" : {
      "b" : {
        "c" : "value"
      },
      "d" : null
    }
  };

  it('mask #1', function(done) {
    var stylesheet = {
      "$a" : {
        "find": "a",
        "mask" : "b"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a.b.c, 'value');
      assert.equal(output.a.d, undefined);
      done(err);
    });
  });

});
