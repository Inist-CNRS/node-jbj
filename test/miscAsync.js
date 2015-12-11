/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

JBJ.use(require('../lib/filters/parse.js'));
JBJ.use(require('../lib/filters/array.js'));

describe('asynchronous misc', function () {

  var input = {
    "a" : {
      "b" : {
        "c" : "1234"
      },
      "d" : null
    }
  };

  it('misc #1', function(done) {
    var stylesheet = {
      "$a" : {
        "find": "a.b.c",
        "cast" : "number"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a, 1234);
      done(err);
    });
  });

  it('misc #2', function(done) {
    var stylesheet = {
      "$a" : {
        "find": "a.b.d",
        "default": "truc"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a, "truc");
      done(err);
    });
  });

  it('misc #3', function(done) {
    var stylesheet = {
      "$a" : {
        "find": "a.b.d",
        "required": true
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert(output.a instanceof Error);
      done(err);
    });
  });

  it('misc #4', function(done) {
    var stylesheet = {
      "extendWith": {
        "a" : {
          "b" : {
            "cc" : "val1"
          },
          "d" : "val2"
        }
      },
    };
    var output = JBJ.render(stylesheet, "val", function (err, output) {
      assert.equal(output, "val");
      done(err);
    });
  });

  it('misc #5', function(done) {
    var stylesheet = {
      "extendWith": {
        "a" : {
          "b" : {
            "cc" : "val1"
          },
          "d" : "val2"
        }
      },
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a.b.cc, "val1");
      assert.equal(output.a.d, "val2");
      done(err);
    });
  });

  it('misc #6', function(done) {
    var stylesheet = {
      "set": {
        "a" : {
          "b" : "val1",
          "e" : "val2"
        }
      },
    };
    var output = JBJ.render(stylesheet, "val", function (err, output) {
      assert.equal(output.a.b, "val1");
      assert.equal(output.a.d, undefined);
      assert.equal(output.a.e, "val2");
      done(err);
    });
  });

  it('#misc #7', function (done) {
    var stylesheet = {
      "set": [1,2,3],
      "sum": true
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 6);
      done(err);
    });
  });

  it('#misc #7b', function (done) {
    var stylesheet = {
      "set": "[1,2,3]",
      "sum": true
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.toString(), "Error: Input object should be an array");
      done();
    });
  });

  it('misc #8', function (done) {
    var stylesheet = {
      "set": {
        "array1": [{"_id": "1", "value": 1},  {"_id": "2", "value": 2}],
        "array2": [{"_id": "1", "value": 10}, {"_id": "2", "value": 20}]
      },
      "zip": [ "array1", "array2" ]
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(output[0]._id, "1");
      assert.equal(output[0].array1, 1);
      assert.equal(output[0].array2, 10);
      assert.equal(output[1]._id, "2");
      assert.equal(output[1].array1, 2);
      assert.equal(output[1].array2, 20);
      done();
    });
  });

});
