/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

function request(urlObj, callback) {
  var buf = '', req = require('http').get(urlObj, function(res) {
    if (res.statusCode !== 200) {
      return callback(new Error('HTTP Error ' + res.statusCode));
    }
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      buf += chunk.toString();
    });
    res.on('error', callback);
    res.on('end', function() {
      callback(null, buf);
    });
  });

  req.on('error', callback);
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
      "$?" : "http://registry.npmjs.com/jbjj",
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


  it('good input', function(done) {
    var stylesheet = {
      "$?" : "http://registry.npmjs.com/jbj",
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
