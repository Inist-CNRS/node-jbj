/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , path =require('path')
  , JBJ = require('..');

JBJ.use(require('../lib/filters/parse.js'));

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
      "$?" : "oups://raw.githubusercontent.com/castorjs/node-jbj/master/package.json",
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
      "$?" : "file://" + path.resolve(__dirname, '../dataset/X.json'),
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
      "$?" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
      "parseJSON" : true,
      "$name" : {
        "path": "name",
        "upcase": null
      },
      "$main": {
        "path": "main",
        "upcase": null
      }
    };
    JBJ.render(stylesheet, function(error, output) {
      assert.equal(error, null);
      assert.equal(output.name, "JBJ");
      assert.equal(output.main, "INDEX.JS");
      done();
    });
  });


  it('#2', function(done) {
    var stylesheet = {
      "$name" : {
        "$?" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
        "parseJSON" : true,
        "path": "name"
      },
      "$main": {
        "$?" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
        "parseJSON" : true,
        "path": "main",
      }
    };
    JBJ.render(stylesheet, {}, function(error, output) {
      assert.equal(error, null);
      assert.equal(output.name, "jbj");
      assert.equal(output.main, "index.js");
      done();
    });
  });

  it('#3', function(done) {
    var stylesheet = {
      "$?" : "file://" + path.resolve(__dirname, '../dataset/1.json'),
      "parseJSON" : true,
      "path": "name"
    };
    JBJ.render(stylesheet, {}, function(error, output) {
      assert.equal(error, null);
      assert.equal(output, "jbj");
      done();
    });
  });

  it('should read CSV files, and return a string', function (done) {
    var stylesheet = {
      "$?" : "file://" + path.resolve(__dirname, '../dataset/1.csv'),
    };
    JBJ.render(stylesheet, {}, function(error, output) {
      assert(!Buffer.isBuffer(output));
      done();
    });
  });

});
