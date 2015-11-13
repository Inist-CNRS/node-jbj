/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

JBJ.use(require('../lib/filters/template.js'));

describe('asynchronous weird', function () {

  var input = {
    "a" : {
      "b" : {
        "c" : "1"
      },
      "d" : "2",
      "e" : "4"
    },
    "f": "8"
  };

  // see https://github.com/castorjs/castor-core/issues/5
  it('weird #1', function(done) {
    var stylesheet = {
      "$language" : {
        "template": "X{{a.b.c}}X{{a.d}}X{{a.e}}X{{f}}",
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.language, "X1X2X4X8");
      done(err);
    });
  });

});
