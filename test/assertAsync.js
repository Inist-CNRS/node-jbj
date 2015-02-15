/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('asynchronous breakif', function () {

  var input = {
    "val" : "unmodified",
    "a" : 1,
    "b" : "one"
  };

  it('#1', function(done) {
    var stylesheet = {
      "$val" : {
        "breakif": "a > 0",
        "set" : "modified"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, null);
      done(err);
    });
  });

  it('#2', function(done) {
    var stylesheet = {
      "$val" : {
        "breakIf": "a < 0",
        "set" : "modified"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, "modified");
      done(err);
    });
  });

  it('#3', function(done) {
    var stylesheet = {
      "$val" : {
        "breakIf": "b == \"one\"",
        "set" : "modified"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, null);
      done(err);
    });
  });

  it('#4', function(done) {
    var stylesheet = {
      "$val" : {
        "breakIf": "b != \"one\"",
        "set" : "modified"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, "modified");
      done(err);
    });
  });


  it('#5', function(done) {
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
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, "else");
      done(err);
    });
  });

  it('#5 bis', function(done) {
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
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, null);
      done(err);
    });
  });

  it('#5 ter', function(done) {
    var stylesheet = {
      "$val#1" : {
        "set" : "if"
      },
      "$val#2" : {
        "breakIf": "a != 1",
        "set" : "else"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, "else");
      done(err);
    });
  });

  it('#6', function(done) {
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
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, "if val");
      done(err);
    });
  });

  it('#6 bis', function(done) {
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
    var output = JBJ.render(stylesheet, input, function (err, input) {
      assert.equal(output.val, "else val");
      done(err);
    });
  });

  it('#7', function(done) {
    var stylesheet = {
      "$val" : {
        "get" : "a",
        "assert": "this == 1",
        "set" : "if val"
      }
    };
    var output = JBJ.render(stylesheet, input, function (err, output) {
      assert.equal(output.val, "if val");
      done(err);
    });
  });

});
