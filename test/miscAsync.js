/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

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
        "default": '["truc", "bidule"]',
        "unjson": null
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.a[0], "truc");
      done(err);
    });
  });

  it('misc #4', function(done) {
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
    var output = JBJ.render(stylesheet, "val", function (err, output) {
      assert.equal(output, "val");
      done(err);
    });
  });

  it('misc #5b', function(done) {
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

});
