/*jshint node:true, laxcomma:true */
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('../')
  , examples = require('./slug.json');

describe('slug', function () {
  Object.keys(examples).forEach(function (example) {
    it(example, function (done) {
      var input      = examples[example].input;
      var stylesheet = examples[example].stylesheet;
      var expected   = examples[example].expected;
      JBJ.render(stylesheet, input, function (err, output) {
        assert.deepEqual(output, expected);
        done(err);
      });
    });
  });
});
