/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

describe('JBJ', function () {

  it('send string', function(done) {
    var output = JBJ.render({}, 'test', function (err, output) {
      assert.equal(output, 'test');
      done(err);
    });
  });

  // TODO: translate synchronous test
  // it('with no stylesheet', function(done) {
  //   assert.throws(function() {
  //     JBJ.render(null, 'test', done);
  //   });
  // });
  /* */
});
