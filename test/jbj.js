/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('JBJ', function () {
  it('send string', function() {
    var output = JBJ.renderSync({}, 'test');
    assert.equal(output, 'test');
  });
  it('with no stylesheet', function() {
    assert.throws(function() {
      JBJ.renderSync(null, 'test');
    });
  })
  /* */
});
