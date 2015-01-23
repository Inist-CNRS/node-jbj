/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('JBJ', function () {
  it('send string', function() {
    var output = JBJ.render({}, 'test');
    assert.equal(output, 'test');
  });
  it('with no stylesheet', function() {
    var output = JBJ.render(null, 'test');
    assert.equal(output, 'test');
  })
  /* */
});
