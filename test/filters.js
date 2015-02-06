
/* global describe, it */
'use strict';
var assert = require('assert')
  , JBJ = require('..');

JBJ.filters.toto = function(obj, arg) {
  return String(obj) + String(arg) + '!';
}
describe('filters', function () {
 it('misc #1', function() {
    var stylesheet = {
      "set" : "titi",
      "toto": "tata"
    };
    var output = JBJ.renderSync(stylesheet);
    assert.equal(output, 'tititata!');
  });


});
