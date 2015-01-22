'use strict';
var objectPath = require('object-path')

function exec(parmeters, func) {
  if (typeof parmeters === 'string') {
    return func(parmeters);
  }
  else if (Array.isArray(parmeters)) {
    return parmeters.map(func).filter(function(i) { return (i !== '' && i !== undefined && i !== null); });
  }
}

exports.render = function (stylesheet, input)
{
  if (typeof stylesheet !== 'object' || typeof input !== 'object') {
    return input;
  }
  var holder = input;

  Object.keys(stylesheet).forEach(function(key) {
    var parmeters = stylesheet[key]
      , action = key.replace(/#[0-9]+$/, '');
    if (action === 'find') {
      holder = exec(parmeters, function(p) {
        return objectPath.get(holder, p);
      });
    }
  });
  return holder;
}
