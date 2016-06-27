/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('error', function () {

  it('error #1', function(done) {
      var input = {
    "a" : {
      "b" : {
        "c" : "1234"
      },
      "d" : null
    }
  };
    var stylesheet = {
      "assert" : "a == 'X"
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(err.name, 'Error');
      assert.equal(output, undefined);
      done();
    })
  });


});
