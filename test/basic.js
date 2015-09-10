/*jshint node:true, laxcomma:true */
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('basic', function () {
  var input = {
    "a" : {
      "b" : {
        "c" : "value"
      },
      "d" : ['C', 'B', 'A'],
      "e" : 3
    }
  };

  it('basic #1', function() {
    var stylesheet = {
      "get": "a.b.c",
      "capitalize" : null
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'Value');
  });

  it('basic #2', function() {
    var stylesheet = {
      "get": "a.b.c",
      "upcase" : null
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'VALUE');
  });

  it('basic #3', function() {
    var stylesheet = {
      "get": "a.b.c",
      "upcase" : null,
      "downcase" : null
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'value');
  });

  it('basic #4', function() {
    var stylesheet = {
      "get": "a.d",
      "first" : null
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'C');
  });

  it('basic #5', function() {
    var stylesheet = {
      "get": "a.d",
      "last" : null
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'A');
  });

  it('basic #6', function() {
    var stylesheet = {
      "get": "a.d",
      "sort" : null,
      "first" : null
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'A');
  });

  it('basic #6b', function () {
    var stylesheet = {
      "get": "a.d",
      "sort": true
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.deepEqual(output, ["A","B","C"]);
  });

  it('basic #7', function() {
    var stylesheet = {
      "get": "a.d",
      "length" : null,
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 3);
  });

  it('basic #8', function() {
    var stylesheet = {
      "get": "a.e",
      "plus" : 3,
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 6);
  });

  it('basic #9', function() {
    var stylesheet = {
      "get": "a.e",
      "minus" : 2,
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 1);
  });

  it('basic #10', function() {
    var stylesheet = {
      "get": "a.e",
      "times" : 2,
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 6);
  });

  it('basic #11', function() {
    var stylesheet = {
      "get": "a.e",
      "times" : 2,
      "dividedBy" : 3
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 2);
  });

  it('basic #12', function() {
    var stylesheet = {
      "get": "a.d",
      "join" : "/"
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'C/B/A');
  });

  it('basic #13', function() {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "truncate": 3
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'C/B');
  });


  it('basic #14', function() {
    var stylesheet = {
      "get": "a.d",
      "join" : " ",
      "truncateWords": 2
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'C B');
  });

  it('basic #15', function() {
    var stylesheet = {
      "get": "a.e",
      "cast" : "string",
      "prepend": "#"
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, '#3');
  });

  it('basic #15.2', function () {
    var stylesheet = {
      "get"  : "unknown",
      "join" : "; "
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(typeof output, "object");
    assert.equal(Object.keys(output).length, 0);
  });

   it('basic #16', function() {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "truncate": 3,
      "append": "..."
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'C/B...');
  });

  it('basic #17', function() {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "truncate": 3,
      "shift": 2,
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'B');
  });

  it('basic #18', function() {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "replace": "/",
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'CBA');
  });

  it('basic #19', function() {
    var stylesheet = {
      "get": "a.d",
      "join" : "/",
      "replace": ["/", "|"],
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 'C|B|A');
  });

  it('basic #20.1', function() {
    var stylesheet = {
      "get" : "a.b.c",
      "mapping" : {
        "value" : 1
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, 1);
  });

  it('basic #20.2', function() {
    var stylesheet = {
      "default" : 1,
      "mapping" : ['a','b','c']
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, 'b');
  });

  it('basic #20.3', function() {
    var stylesheet = {
      "set": [1, 2],
      "mapping": ['a','b','c']
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '["b","c"]');
  });

  it('basic #20.4', function() {
    var stylesheet = {
      "set": ["a", "b"],
      "mapping": {
        "a": "Aha!",
        "b": "Baby"
      }
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '["Aha!","Baby"]');
  });

  it('basic #20.5', function() {
    var input = {
      "arg": { "a": "Aha!", "b": "Baby"},
      "input": "a"
    };
    var stylesheet = {
      "mappingVar": ["input", "arg"]
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, "Aha!");
  });

  it('basic #21', function() {
    var stylesheet = {
      "set" : [2, 4,1,7, 9,3],
      "min" : true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, 1);
  });
  it('basic #22', function() {
    var stylesheet = {
      "set" : [2, 4, 1, 7, 9, 3],
      "max" : true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, 9);
  });
  it('basic #23', function() {
    var stylesheet = {
      "set" : {a: 9, b: 4, c: 3, d: 5},
      "min" : true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, 3);
  });

  it('basic #24', function() {
    var stylesheet = {
      "set"     : [ ['a', 'b'], ['c', 'd'], 'e'],
      "flatten" : true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '["a","b","c","d","e"]');
  });

  it('basic #25', function() {
    var stylesheet = {
      "set"     : { 'a': 1, 'b': [2, 3]},
      "flatten" : true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '{"a":1,"b":[2,3]}');
  });

  it('basic #26', function() {
    var stylesheet = {
      "set"         : [ 1, 2, 3, 1, 2],
      "deduplicate" : true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '[1,2,3]');
  });

  it('basic #27', function() {
    var stylesheet = {
      "set"    : [ 1, 2, 3],
      "remove" : 2
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '[1,3]');
  });

  it('basic #28', function() {
    var stylesheet = {
      "set"    : [ "a", "", "b"],
      "remove" : ""
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '["a","b"]');
  });

  it('basic #29', function() {
    var stylesheet = {
      "set"    : [ "a", "b", "c"],
      "remove" : "b"
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(JSON.stringify(output), '["a","c"]');
  });

   it('basic #30', function() {
    var stylesheet = {
      "$x" : {
        "set" : "X",
      },
      "$y" : {
        "get": "x"
      }
   };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.x, "X");
    assert.equal(output.y, "X");
  });

  it('basic #31', function() {
    var stylesheet = {
      "get" : "a.b.c",
      "append" : ">"
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, "value>");
  });

  it('basic #32', function() {
    var stylesheet = {
      "get" : "a.b.c",
      "prepend" : "<",
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output, "<value");
  });


  it('basic #33', function () {
    var stylesheet = {
      "set"       : "20150310",
      "substring" : [4,2]
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, "03");
  });

  it('basic #34', function () {
    var stylesheet = {
      "set"        : [ "a", "b", "c" ],
      "getproperty": "2"
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, "c");
  });

  it('basic #35', function () {
    var stylesheet = {
      "set"        : { "a": 0, "b": 1, "c":2 },
      "getproperty": "b"
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, 1);
  });

  it('basic #36', function () {
    var stylesheet = {
      "set": {
        "i": 1,
        "t": ["a","b","c"]
      },
      "getPropertyVar": ["t", "i"]
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, "b");
  });

  it('basic #37', function () {
    var stylesheet = {
      "set": {
        "i" : "b",
        "o" : { "a": 0, "b": 1, "c":2 },
      },
      "getPropertyVar": ["o", "i"]
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, 1);
  });

  it('basic #38', function () {
    var stylesheet = {
      "set": [
        {
          "_id": "2007",
          "value": 538
        }, {
          "_id": "2008",
          "value": 577
        }, {
          "_id": "2009",
          "value": 611
      }],
      "array2object": true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output[2007], 538);
    assert.equal(output[2008], 577);
    assert.equal(output[2009], 611);
  });

  it('basic #38b', function () {
    var stylesheet = {
      "set": [
        {
          "key": "2007",
          "val": 538
        }, {
          "key": "2008",
          "val": 577
        }, {
          "key": "2009",
          "val": 611
      }],
      "array2object": ["key","val"]
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output[2007], 538);
    assert.equal(output[2008], 577);
    assert.equal(output[2009], 611);
  });

  it('basic #39', function () {
    var stylesheet = {
      "set" : [ 5, 3, 2 ],
      "sort": true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output[0], 2);
    assert.equal(output[1], 3);
    assert.equal(output[2], 5);
  });

  it('basic #40', function () {
    var stylesheet = {
      "set": [ [ "Afghanistan", "AFG" ],
               [ "Aland Islands", "ALA" ] ],
      "arrays2objects": true
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output[0]._id,"Afghanistan");
    assert.equal(output[0].value, "AFG");
    assert.equal(output[1]._id, "Aland Islands");
    assert.equal(output[1].value, "ALA");
  });

  it('basic #41', function () {
    var stylesheet = {
      "set": [ [ "Afghanistan", "AFG" ],
               [ "Aland Islands", "ALA" ] ],
      "arrays2objects": ["key", "val"]
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output[0].key,"Afghanistan");
    assert.equal(output[0].val, "AFG");
    assert.equal(output[1].key, "Aland Islands");
    assert.equal(output[1].val, "ALA");
  });

});
