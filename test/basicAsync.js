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
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'Value');
      done(err);
    });
  });

  it('basic #2', function(done) {
    var stylesheet = {
      "get": "a.b.c",
      "upcase" : null
    };
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'value');
      done(err);
    });
  });

  it('basic #4', function(done) {
    var stylesheet = {
      "get": "a.d",
      "first" : null
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C');
      done(err);
    });
  });

  it('basic #5', function(done) {
    var stylesheet = {
      "get": "a.d",
      "last" : null
    };
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'A');
      done(err);
    });
  });

  it('basic #6b', function (done) {
    var stylesheet = {
      "get": "a.d",
      "sort": true
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.deepEqual(output, ["A","B","C"]);
      done(err);
    });
  });

  it('basic #7', function(done) {
    var stylesheet = {
      "get": "a.d",
      "length" : null,
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 3);
      done(err);
    });
  });

  it('basic #8', function(done) {
    var stylesheet = {
      "get": "a.e",
      "plus" : 3,
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 6);
      done(err);
    });
  });

  it('basic #9', function(done) {
    var stylesheet = {
      "get": "a.e",
      "minus" : 2,
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 1);
      done(err);
    });
  });

  it('basic #10', function(done) {
    var stylesheet = {
      "get": "a.e",
      "times" : 2,
    };
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 2);
      done(err);
    });
  });

  it('basic #12', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/"
    };
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, '#3');
      done(err);
    });
  });

  it('basic #15.2', function (done) {
    var stylesheet = {
      "get"  : "unknown",
      "join" : "; "
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, undefined);
      assert.equal(err.name, 'TypeError');
      done();
    });
  });



   it('basic #16', function(done) {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "truncate": 3,
      "append": "..."
    };
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
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
    JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output, 'C|B|A');
      done(err);
    });
  });

  it('basic #21', function(done) {
    var stylesheet = {
      "set" : [2, 4,1,7, 9,3],
      "min" : true
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 1);
      done(err);
    });
  });

  it('basic #22', function(done) {
    var stylesheet = {
      "set" : [2, 4, 1, 7, 9, 3],
      "max" : true
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 9);
      done(err);
    });
  });

  it('basic #23', function(done) {
    var stylesheet = {
      "set" : {a: 9, b: 4, c: 3, d: 5},
      "min" : true
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(output, 3);
      done(err);
    });
  });

  it('basic #24', function(done) {
    var stylesheet = {
      "set"     : [ ['a', 'b'], ['c', 'd'], 'e'],
      "flatten" : true
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '["a","b","c","d","e"]');
      done(err);
    });
  });

  it('basic #25', function(done) {
    var stylesheet = {
      "set"     : { 'a': 1, 'b': [2, 3]},
      "flatten" : true
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '{"a":1,"b":[2,3]}');
      done(err);
    });
  });

  it('basic #26', function(done) {
    var stylesheet = {
      "set"         : [ 1, 2, 3, 1, 2],
      "deduplicate" : true
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '[1,2,3]');
      done(err);
    });
  });

  it('basic #27', function(done) {
    var stylesheet = {
      "set"    : [ 1, 2, 3],
      "remove" : 2
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '[1,3]');
      done(err);
    });
  });

  it('basic #28', function(done) {
    var stylesheet = {
      "set"    : [ "a", "", "b"],
      "remove" : ""
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '["a","b"]');
      done(err);
    });
  });

  it('basic #29', function(done) {
    var stylesheet = {
      "set"    : [ "a", "b", "c"],
      "remove" : "b"
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(JSON.stringify(output), '["a","c"]');
      done(err);
    });
  });
  
  it('basic #39', function (done) {
    var stylesheet = {
      "set" : [ 5, 3, 2 ],
      "sort": true
    };
    JBJ.render(stylesheet, function (err, output) {
      assert.equal(output[0], 2);
      assert.equal(output[1], 3);
      assert.equal(output[2], 5);
      done(err);
    });
  });

  it('basic #42 - expect', function (done) {
    var input = undefined;
    var stylesheet = {
      "expect": {
        "a": 1,
        "b": 2
      }
    };
    var expected = {
      "a": 1,
      "b": 2
    }
    JBJ.render(stylesheet, input, function (err, output) {
      assert(output);
      assert.equal(output.a, 1);
      assert.equal(output.b, 2);
      done(err);
    });
  });

  it('basic #43 - expect', function (done) {
    var input = {
      "a": 3
    };
    var stylesheet = {
      "expect": {
        "a": 1,
        "b": 2
      }
    };
    var expected = {
      "a": 3,
      "b": 2
    }
    JBJ.render(stylesheet, input, function (err, output) {
      assert(output);
      assert.equal(output.a, 3);
      assert.equal(output.b, 2);
      done(err);
    });
  });

  it('basic #44 - add', function (done) {
    var input = { };
    var stylesheet = {
      "add": ["tag", "span"]
    };
    var expected = {
      "tag": "span"
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert(output);
      assert.equal(output.tag, "span");
      done(err);
    });
  });

  it('basic #45 - add', function (done) {
    var input = {
      "content": "not empty"
    };
    var stylesheet = {
      "add": ["tag", "span"]
    };
    var expected = {
      "content": "not empty",
      "tag": "span"
    };
    JBJ.render(stylesheet, input, function (err, output) {
      assert(output);
      assert.equal(output.tag, "span");
      done(err);
    });
  });

});
