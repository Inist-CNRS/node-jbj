/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , path =require('path')
  , JBJ = require('..');

describe('file', function () {
  it('no input', function(done) {
    var stylesheet = {
      "$name" : {
        "upcase": null
      },
      "$main": {
        "upcase": null
      }
    };
    JBJ.render(stylesheet, function(error, output) {
      assert(error instanceof Error);
      assert.equal(output, null);
      done();
    });
  });

  it('bad input', function(done) {
    var stylesheet = {
      "fetch" : "oups://raw.githubusercontent.com/castorjs/node-jbj/master/package.json",
      "$name" : {
        "upcase": null
      },
      "$main": {
        "upcase": null
      }
    };
    JBJ.render(stylesheet, function(error, output) {
      assert(error instanceof Error);
      done();
    });
  });

  it('wrong input', function(done) {
    var stylesheet = {
      "fetch" : "file://" + path.resolve(__dirname, '../dataset/X.json'),
      "$name" : {
        "upcase": null
      },
      "$main": {
        "upcase": null
      }
    };
    JBJ.render(stylesheet, function(error, output) {
      assert(error instanceof Error);
      done();
    });
  });

  it('#1', function(done) {
    var stylesheet = {
      "fetch" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
      "upcase": true
    };
    JBJ.render(stylesheet, function(error, output) {
      assert.equal(error, null);
      assert.notEqual(output.search("JBJ"), -1);
      assert.notEqual(output.search("INDEX.JS"), -1);
      done();
    });
  });


  it('#2', function(done) {
    var stylesheet = {
      "$name" : {
        "fetch" : "file://" + path.resolve(__dirname, '../dataset/1.json')
      },
      "$main": {
        "fetch" : "file://" + path.resolve(__dirname, '../dataset/1.json')
      }
    };
    JBJ.render(stylesheet, {}, function(error, output) {
      assert.equal(error, null);
      assert.equal(output.name, output.main);
      done();
    });
  });

  it('#3', function(done) {
    var stylesheet = {
      "fetch" : "file://" + path.resolve(__dirname, '../dataset/1.json')
    };
    JBJ.render(stylesheet, {}, function(error, output) {
      assert.equal(error, null);
      assert.notEqual(output.search("jbj"), -1);
      done();
    });
  });

  it('should read CSV files, and return a string', function (done) {
    var stylesheet = {
      "fetch" : "file://" + path.resolve(__dirname, '../dataset/1.csv'),
    };
    JBJ.render(stylesheet, {}, function(error, output) {
      assert(!Buffer.isBuffer(output));
      done();
    });
  });

});
