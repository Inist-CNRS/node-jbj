/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

JBJ.use(require('../lib/filters/template.js'));

describe('asynchronous template', function () {

 it('template #1', function(done) {
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

    var stylesheet = {
      "$a" : {
        "template": "X{{a.b.c}}X{{a.d}}X{{a.e}}X{{f}}",
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a, "X1X2X4X8");
      done(err);
    });
  });

  it('template #2', function(done) {
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
 
    var stylesheet = {
      "$a" : {
        "templateURL": "file://" + require('path').resolve(__dirname, "./template.mustache")
      }
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a, "X1X2X4X8\n");
      done(err);
    });
  });



});
