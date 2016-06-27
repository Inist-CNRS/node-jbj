/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

// Mock an HTTP request
function request(urlObj, callback) {
  if ("http://registry.npmjs.com/jbj" === urlObj.href) {
    return callback(null, "{ \"name\": \"jbj\" }");
  } else {
    return callback(new Error('HTTP Error'));
  }
}
JBJ.register('http:', request);

describe('url', function () {

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
      "fetch" : "oups://raw.githubusercontent.com/castorjs/node-jbj/master/package.json",
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
      "fetch" : "http://registry.npmjs.com/jbjj",
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
      "fetch" : "http://qsqsdqsd.qsdqsd.fr",
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


  it('good input', function(done) {
    var stylesheet = {
      "fetch" : "http://registry.npmjs.com/jbj",
      "parseJSON" : true,
      "$name" : {
        "path": "name",
        "upcase": null
      }    };
    var output = JBJ.render(stylesheet, function(error, output) {
      assert.equal(error, null);
      assert.equal(output.name, "JBJ");
      done();
    });
  });

});
