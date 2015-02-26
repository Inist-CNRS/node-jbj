/*jshint node:true,laxcomma:true*/
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

  it('error #1', function() {
    var stylesheet = {
      "$a" : {
        "default" : "\"xxxx",
        "parseJSON" : true
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.a.name, 'SyntaxError');
  });

});
