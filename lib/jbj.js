'use strict';
var filters = require('./filters.js')
  , objectPath = require('object-path');

exports.render = function (stylesheet, input)
{
  if (typeof stylesheet !== 'object' || typeof input !== 'object') {
    return input;
  }
  var holder = input;
  Object.keys(stylesheet).forEach(function(key) {
    // console.log(key + '+', stylesheet[key], 'with', holder);
    var filter = key.replace(/#[0-9]+$/, '');
    if (filter[0] === '$' && filter[1] === '$') {
      holder = exports.render(stylesheet[key], holder);
    }
    else if (filter[0] === '$' && filter[1] !== '$') {
      var path = filter.slice(1);
      objectPath.set(holder, path, exports.render(stylesheet[key], holder));
    }
    else if (typeof filters[filter] === 'function') {
      if (holder instanceof Error) {
        console.error(holder);
      }
      else {
        holder = filters[filter](holder, stylesheet[key]);
        // console.log(key + '=', holder);
      }
    }
  });
  return holder;
}
