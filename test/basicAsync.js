/*jshint node:true, laxcomma:true */
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('asynchronous basic', function (done) {
  var input = {
    "a" : {
      "b" : {
        "c" : "value"
      },
      "d" : ['C', 'B', 'A'],
      "e" : 3
    }
  };

  it('basic #1', function(done) {
    var stylesheet = {
      "get": "a.b.c",
      "capitalize" : null
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'Value');
      done(err);
    });
  });

  it('basic #2', function(done) {
    var stylesheet = {
      "get": "a.b.c",
      "upcase" : null
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'VALUE');
      done(err);
    });
  });

  it('basic #3', function(done) {
    var stylesheet = {
      "get": "a.b.c",
      "upcase" : null,
      "downcase" : null
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'value');
      done(err);
    });
  });

  it('basic #4', function(done) {
    var stylesheet = {
      "get": "a.d",
      "first" : null
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C');
      done(err);
    });
  });

  it('basic #5', function(done) {
    var stylesheet = {
      "get": "a.d",
      "last" : null
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'A');
      done(err);
    });
  });

  it('basic #6', function(done) {
    var stylesheet = {
      "get": "a.d",
      "sort" : null,
      "first" : null
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'A');
      done(err);
    });
  });

  it('basic #7', function(done) {
    var stylesheet = {
      "get": "a.d",
      "length" : null,
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 3);
      done(err);
    });
  });

  it('basic #8', function(done) {
    var stylesheet = {
      "get": "a.e",
      "plus" : 3,
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 6);
      done(err);
    });
  });

  it('basic #9', function(done) {
    var stylesheet = {
      "get": "a.e",
      "minus" : 2,
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 1);
      done(err);
    });
  });

  it('basic #10', function(done) {
    var stylesheet = {
      "get": "a.e",
      "times" : 2,
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 6);
      done(err);
    });
  });

  it('basic #11', function(done) {
    var stylesheet = {
      "get": "a.e",
      "times" : 2,
      "dividedBy" : 3
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 2);
      done(err);
    });
  });

  it('basic #12', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/"
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C/B/A');
      done(err);
    });
  });

  it('basic #13', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "truncate": 3
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C/B');
      done(err);
    });
  });


  it('basic #14', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : " ",
      "truncateWords": 2
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C B');
      done(err);
    });
  });

  it('basic #15', function(done) {
    var stylesheet = {
      "get": "a.e",
      "cast" : "string",
      "prepend": "#"
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, '#3');
      done(err);
    });
  });

  it('basic #15.2', function (done) {
    var stylesheet = {
      "get"  : "unknown",
      "join" : "; "
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(typeof output, "object");
      assert.equal(Object.keys(output).length, 0);
      done(err);
    });
  });



   it('basic #16', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "truncate": 3,
      "append": "..."
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C/B...');
      done(err);
    });
  });

  it('basic #17', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "truncate": 3,
      "shift": 2,
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'B');
      done(err);
    });
  });

  it('basic #18', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "replace": "/",
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'CBA');
      done(err);
    });
  });

  it('basic #19', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "replace": ["/", "|"],
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C|B|A');
      done(err);
    });
  });

  it('basic #20', function(done) {
    var stylesheet = {
      "get" : "a.b.c",
      "mapping" : {
        "value" : 1
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 1);
      done(err);
    });
  });

  it('basic #20', function(done) {
    var stylesheet = {
      "default" : 1,
      "mapping" : ['a','b','c']
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 'b');
      done(err);
    });
  });

  it('basic #21', function(done) {
    var stylesheet = {
      "set" : [2, 4,1,7, 9,3],
      "min" : true
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 1);
      done(err);
    });
  });

  it('basic #22', function(done) {
    var stylesheet = {
      "set" : [2, 4, 1, 7, 9, 3],
      "max" : true
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 9);
      done(err);
    });
  });

  it('basic #23', function(done) {
    var stylesheet = {
      "set" : {a: 9, b: 4, c: 3, d: 5},
      "min" : true
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 3);
      done(err);
    });
  });

  it('basic #24', function(done) {
    var stylesheet = {
      "set"     : [ ['a', 'b'], ['c', 'd'], 'e'],
      "flatten" : true
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '["a","b","c","d","e"]');
      done(err);
    });
  });

  it('basic #25', function(done) {
    var stylesheet = {
      "set"     : { 'a': 1, 'b': [2, 3]},
      "flatten" : true
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '{"a":1,"b":[2,3]}');
      done(err);
    });
  });

  it('basic #26', function(done) {
    var stylesheet = {
      "set"         : [ 1, 2, 3, 1, 2],
      "deduplicate" : true
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '[1,2,3]');
      done(err);
    });
  });

  it('basic #27', function(done) {
    var stylesheet = {
      "set"    : [ 1, 2, 3],
      "remove" : 2
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '[1,3]');
      done(err);
    });
  });

  it('basic #28', function(done) {
    var stylesheet = {
      "set"    : [ "a", "", "b"],
      "remove" : ""
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '["a","b"]');
      done(err);
    });
  });

  it('basic #29', function(done) {
    var stylesheet = {
      "set"    : [ "a", "b", "c"],
      "remove" : "b"
    };
    var output = JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '["a","c"]');
      done(err);
    });
  });

});
