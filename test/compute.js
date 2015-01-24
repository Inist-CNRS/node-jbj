/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('compute', function () {
  var input = {
    "a" : {
      "b" : {
        "c" : "1"
      },
      "d" : "2",
      "e" : "4"
    },
    "f": "8"
  };

  it('template #1', function() {
    var stylesheet = {
      "$remote" : {
          "fetch" : "/corpus?i1"
      },
      "$g" : {
        "find": "a.b.c",
        "cast": "number"
      },
      "$h" : {
        "find": "a.d",
        "cast": "number"
      },
      "$i" : {
        "find": "a.e",
        "cast": "number"
      },
      "$j" : {
        "find": "f",
        "cast": "number"
      },
      "$k": {
        "compute": " g + h + i + j"
      }
    };
    var output = JBJ.render(stylesheet, input);
    assert.equal(output.k, 15);
  });


});
