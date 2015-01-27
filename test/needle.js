
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('needle', function () {

  it('no input', function(done) {
    var stylesheet = {
      "$name" : {
        "upcase": null
      },
      "$main": {
        "upcase": null
      }
    };
    var output = JBJ.render(stylesheet, function(error, output) {
      assert(error instanceof Error);
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
    var output = JBJ.render(stylesheet, function(error, output) {
      assert(error instanceof Error);
      done();
    });
  });

  it('wrong input', function(done) {
    var stylesheet = {
      "$?" : "https://raw.githubusercontent.com/castorjs/node-jbj/master/package.jso",
      "$name" : {
        "upcase": null
      },
      "$main": {
        "upcase": null
      }
    };
    var output = JBJ.render(stylesheet, function(error, output) {
      assert(error instanceof Error);
      done();
    });
  });

  it('failed input', function(done) {
    var stylesheet = {
      "$?" : "http://qsqsdqsd.qsdqsd.fr",
      "$name" : {
        "upcase": null
      },
      "$main": {
        "upcase": null
      }
    };
    var output = JBJ.render(stylesheet, function(error, output) {
      assert(error instanceof Error);
      done();
    });
  });


  it('#1', function(done) {
    var stylesheet = {
      "$?" : "https://raw.githubusercontent.com/castorjs/node-jbj/master/package.json",
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
    var output = JBJ.render(stylesheet, function(error, output) {
      assert.equal(error, null);
      assert.equal(output.name, "NODE-JBJ");
      assert.equal(output.main, "INDEX.JS");
      done();
    });
  });


});
