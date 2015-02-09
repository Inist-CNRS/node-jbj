
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('breakif', function () {
  var input = {
    "val" : "unmodified",
    "a" : 1,
    "b" : "one"
  };
  it('#1', function() {
    var stylesheet = {
      "$val" : {
        "breakif": "a > 0",
        "set" : "modified"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, null);
  });

  it('#2', function() {
    var stylesheet = {
      "$val" : {
        "breakIf": "a < 0",
        "set" : "modified"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, "modified");
  });
  it('#3', function() {
    var stylesheet = {
      "$val" : {
        "breakIf": "b == \"one\"",
        "set" : "modified"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, null);
  });

  it('#4', function() {
    var stylesheet = {
      "$val" : {
        "breakIf": "b != \"one\"",
        "set" : "modified"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, "modified");
  });


  it('#5', function() {
    var stylesheet = {
      "$val#1" : {
        "breakIf": "a == 1",
        "set" : "if"
      },
      "$val#2" : {
        "breakIf": "a != 1",
        "set" : "else"
      }

    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, "else");
  });

  it('#5 bis', function() {
    var stylesheet = {
      "$val#1" : {
        "breakIf": "a != 1",
        "set" : "if"
      },
      "$val#2" : {
        "breakIf": "a == 1",
        "set" : "else"
      }

    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, null);
  });

  it('#5 ter', function() {
    var stylesheet = {
      "$val#1" : {
        "set" : "if"
      },
      "$val#2" : {
        "breakIf": "a != 1",
        "set" : "else"
      }

    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, "else");
  });

  it('#6', function() {
    var stylesheet = {
      "$val#1" : {
        "assert": "a == 1",
        "set" : "if val"
      },
      "$val#2" : {
        "get" : "val",
        "default": "else val",
      }

    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, "if val");
  });

  it('#6 bis', function() {
    var stylesheet = {
      "$val#1" : {
        "assert": "a != 1",
        "set" : "if valXXX",
      },
      "$val#2" : {
        "get" : "val",
        "default": "else val",
      }
   };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, "else val");
  });

  it('#7', function() {
    var stylesheet = {
      "$val" : {
        "get" : "a",
        "assert": "this == 1",
        "set" : "if val"
      }
    };
    var output = JBJ.renderSync(stylesheet, input);
    assert.equal(output.val, "if val");
  });

});
