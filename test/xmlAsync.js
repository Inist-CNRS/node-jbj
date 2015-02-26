/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('xml', function () {

  it('#1', function(done) {
    var stylesheet = {
      "default": "<root><item xml:id=\"1\">A</item><item xml:id=\"2\">B</item><item xml:id=\"3\">C</item></root>",
      "parseXML" : {
        "specialChar": "#",
        "longTag" : true
      }
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(output.root.item[0]['xml#id'], "1");
      assert.equal(output.root.item[0]['#text'], "A");
      assert.equal(output.root.item[1]['xml#id'], "2");
      assert.equal(output.root.item[1]['#text'], "B");
      assert.equal(output.root.item[2]['xml#id'], "3");
      assert.equal(output.root.item[2]['#text'], "C");
      done(err);
    });
  });

 it('#2', function(done) {
    var stylesheet = {
      "default": {
        "root" : {
          "item" : [
            { "index" : "1", "$t" : "A"},
            { "index" : "2", "$t" : "B"},
            { "index" : "3", "$t" : "C"}
          ]
        }
      },
      "xml" : {
        "indent": false
      }
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, "<root><item index=\"1\">A</item><item index=\"2\">B</item><item index=\"3\">C</item></root>");
      done(err);
    });
  });

});
