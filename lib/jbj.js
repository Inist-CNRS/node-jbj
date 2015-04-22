'use strict';
var filters = require('./filters.js')
  , url = require('url')
  , fs = require('fs')
  , assert = require('assert')
  , async = require('async')
  , debug = /* console.log  // */ function() { /* noop */ }
  , objectPath = require('object-path');


var registry = {
  "file:" : function(urlObj, callback) {
    fs.readFile(urlObj.pathname, callback);
  }
}

function fetch(urlStr, callback)
{
  assert.equal(typeof urlStr, 'string');
  }

function renderSync(stylesheet, input)
{
  assert.equal(typeof stylesheet, 'object', 'Invalid JSON stylesheet');

  var holder = input;
  Object.keys(stylesheet).every(function(key) {
    var filter = key.replace(/#[0-9]+$/, '');
    if (filter[0] === '$' && filter[1] === '$') {
      debug('replace', filter, ':', stylesheet[key]);
      holder = renderSync(stylesheet[key], holder);
    }
    else if (filter[0] === '$' && filter[1] !== '$' && filter[1] !== '?') {
      debug('set', filter, ':', stylesheet[key]);
      var path = filter.slice(1);
      objectPath.set(holder, path, renderSync(stylesheet[key], holder));
    }
    else if (holder instanceof Error && typeof filters[filter] === 'function') {
      console.error(holder);
    }
    else if ((filter.toLowerCase() === 'assert' || filter.toLowerCase() === 'breakif') && typeof filters[filter] === 'function') {
      var r = filters[filter](holder, stylesheet[key]);
      debug('test',  stylesheet[key], r);
      if (r instanceof Error) {
        holder = r;
        console.error(holder);
        return false;
      }
      else if (r === false) {
        if (input === holder) {
          holder = null;
        }
        return false;
      }
      else {
        return true;
      }
    }
    else if (typeof filters[filter] === 'function') {
      holder = filters[filter](holder, stylesheet[key]);
      debug('exec', filter, ':', stylesheet[key], '=', holder);
    }
    return true;
  });
  return holder;

}


function render(stylesheet, input, callback)
{
  if (!callback) {
    callback = input;
    input = null;
  }
  assert.equal(typeof stylesheet, 'object', 'Invalid JSON stylesheet');
  assert.equal(typeof callback, 'function');

  var water = [];
  water.push(function(callback) {
    callback(null, input);
  });
  debug('render', stylesheet)
  Object.keys(stylesheet).forEach(function(key) {
    water.push(function(holder, callback) {
      var filter = key.replace(/#[0-9]+$/, '');
      if (filter[0] === '$' && filter[1] === '$') {
        debug('replace', filter, ':', stylesheet[key]);
        render(stylesheet[key], holder, callback);
      }
      else if (filter[0] === '$' && filter[1] !== '$' && filter[1] !== '?') {
        debug('set', filter, ':', stylesheet[key]);
        render(stylesheet[key], holder, function(err, res) {
          if (err) {
            callback(err);
          }
          else if (holder === null || holder === undefined )  {
            callback(new Error('No input'));
          }
          else {
            if (typeof holder !== 'object') {
              holder = {};
            }
            var path = filter.slice(1);
            objectPath.set(holder, path, res);
            debug('holder', holder);
            callback(null, holder);
          }
        });
      }
      else if (filter[0] === '$' && filter[1] === '?') {
        debug('fetch', filter, ':', stylesheet[key]);
        var urlObj = require('url').parse(stylesheet[key]);
        if (registry[urlObj.protocol] !== undefined) {
          registry[urlObj.protocol](urlObj, callback);
        }
        else {
          return callback(new Error('Unsupported protocol : `' + urlObj.protocol + '`'));
        }
      }
      else if ((filter.toLowerCase() === 'assert' || filter.toLowerCase() === 'breakif') && typeof filters[filter] === 'function') {
        var r = filters[filter](holder, stylesheet[key]);
        if (input === holder) {
          holder = null;
        }
        if (r === true) {
          return callback(null, holder);
        }
        else {
          return callback(new Error('stop'));
        }
      }
      else if (typeof filters[filter] === 'function') {
        if (holder instanceof Error) {
          callback(holder);
        }
        else {
          callback(null, filters[filter](holder, stylesheet[key]));
        }
        debug('exec', filter, ':', stylesheet[key]);
      }
      else {
        callback(null, holder);
      }
    })
  });

  async.waterfall(water,  function (err, result) {
    if (err === null || (err && err.message === 'stop')) {
      callback(null, result);
    }
    else {
      callback(err);
    }
  });
}





exports.register = function (protocol, callback) {
  assert.equal(typeof protocol, 'string');
  assert.equal(typeof callback, 'function');
  registry[protocol] = callback;
};
exports.render = render;
exports.renderSync = renderSync;
exports.filters = filters;
