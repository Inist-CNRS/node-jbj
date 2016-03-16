/*jshint node:true, laxcomma:true */
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('../')
  , examples = require('./slug.json')
  , examplesEjs = require('./ejs.json')
  ;

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

describe('ejs', function () {
  Object.keys(examplesEjs).forEach(function (example) {
    it(example, function (done) {
      var input      = examplesEjs[example].input;
      var stylesheet = examplesEjs[example].stylesheet;
      var expected   = examplesEjs[example].expected;
      JBJ.render(stylesheet, input, function (err, output) {
        assert.deepEqual(output, expected);
        done(err);
      });
    });
  });
});
