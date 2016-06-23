/*jshint node:true, laxcomma:true */
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('../')
  , examples = require('./slug.json')
  , examplesEjs = require('./ejs.json')
  , examplesAll = require('./examples.json')
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

describe('all', function () {
  Object.keys(examplesAll).forEach(function (example) {
    it(example, function (done) {
      if (examplesAll[example].input && examplesAll[example].stylesheet && examplesAll[example].expected) {
        var input      = examplesAll[example].input;
        var stylesheet = examplesAll[example].stylesheet;
        var expected   = examplesAll[example].expected;
        JBJ.render(stylesheet, input, function (err, output) {
          assert.deepEqual(output, expected);
          done(err);
        });
      }
      else {
        done()
      }
    });
  });
});
