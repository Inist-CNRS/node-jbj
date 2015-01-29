'use strict';
var filters = require('./filters.js')
  , url = require('url')
  , fs = require('fs')
  , assert = require('assert')
  , async = require('async')
  , objectPath = require('object-path');

function fetch(urlStr, callback)
{
  assert.equal(typeof urlStr, 'string');
  var urlObj = require('url').parse(urlStr);

  if (urlObj.protocol === 'file:') {
    fs.readFile(urlObj.pathname, callback);
  }
  else if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
    var urlOpts = {
      proxy : process.env.HTTP_PROXY || process.env.http_proxy || undefined,
      compressed : true,
      follow : true,
      parse : false
    };
    return require('needle').get(urlObj.href, urlOpts, function(error, response) {
      if (error) {
        return callback(error);
      }
      else if (response.statusCode !== 200) {
        return callback(new Error('HTTP Error ' + response.statusCode));
      }
      else if (typeof response.body !== 'string') {
        return callback(new Error('No content'));
      }
      else {
        return callback(null, response.body);
      }
    });
  }
  else {
    return callback(new Error('Unsupported protocol'));
  }
}


function renderSync(stylesheet, input)
{
  assert.equal(typeof stylesheet, 'object', 'Invalid JSON stylesheet');

  var holder = input;
  Object.keys(stylesheet).forEach(function(key) {
    // console.log(key + '+', stylesheet[key], 'with', holder);
    var filter = key.replace(/#[0-9]+$/, '');
    if (filter[0] === '$' && filter[1] === '$') {
      // replace input
      holder = renderSync(stylesheet[key], holder);
    }
    else if (filter[0] === '$' && filter[1] !== '$' && filter[1] !== '?') {
      // set variable
      var path = filter.slice(1);
      objectPath.set(holder, path, renderSync(stylesheet[key], holder));
    }
    else if (typeof filters[filter] === 'function') {
      // exec action
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

  // console.log('render', input);
  Object.keys(stylesheet).forEach(function(key) {
    water.push(function(holder, callback) {
      var filter = key.replace(/#[0-9]+$/, '');
      if (filter[0] === '$' && filter[1] === '$') {
        console.log('replace', filter, ':', stylesheet[key]);
        render(stylesheet[key], holder, callback);
      }
      else if (filter[0] === '$' && filter[1] !== '$' && filter[1] !== '?') {
        console.log('set', filter, ':', stylesheet[key]);
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
            callback(null, holder);
          }
        });
      }
      else if (filter[0] === '$' && filter[1] === '?') {
        console.log('fetch', filter, ':', stylesheet[key]);
        fetch(stylesheet[key], callback);
      }
      else if (typeof filters[filter] === 'function') {
        console.log('exec', filter, ':', stylesheet[key], '=', filters[filter](holder, stylesheet[key]));
        if (holder instanceof Error) {
          callback(holder);
        }
        else {
          callback(null, filters[filter](holder, stylesheet[key]));
        }
      }
    })
  });

  async.waterfall(water, callback);
}





exports.fetch = fetch;
exports.render = render;
exports.renderSync = renderSync;
