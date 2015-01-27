'use strict';
var filters = require('./filters.js')
  , url = require('url')
  , fs = require('fs')
  , needle = require('needle')
  , objectPath = require('object-path');

function render(stylesheet, input, options)
{
  options = options || {};
  if (typeof stylesheet !== 'object' || stylesheet === null || stylesheet ===  undefined) {
    return input;
  }
  else if (typeof input == 'function') {
    // find input data
    var urlStr = stylesheet["$?"];

    if (urlStr === undefined || typeof urlStr !== 'string') {
      return input(new Error('Unable to find input data ($?)'));
    }
    var urlObj = require('url').parse(urlStr);

    if (urlObj.protocol === 'file:') {
      fs.readFile(urlObj.pathname, function (error, data) {
        if (error) {
          input(error);
        }
        else {
          input(null, render(stylesheet, data));
        }
      });
    }
    else if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      var urlOpts = {
        proxy : process.env.HTTP_PROXY || process.env.http_proxy || undefined,
        compressed : true,
        follow : true,
        parse : false
      };
      return needle.get(urlObj.href, urlOpts, function(error, response) {
        if (error) {
          return input(error);
        }
        else if (response.statusCode !== 200) {
          return input(new Error('HTTP Error ' + response.statusCode));
        }
        else if (typeof response.body !== 'string') {
          return input(new Error('No content'));
        }
        else {
          return input(null, render(stylesheet, response.body));
        }
      });
    }
    else {
      return input(new Error('Unsupported protocol'));
    }
  }
  var holder = input;

  Object.keys(stylesheet).forEach(function(key) {
    // console.log(key + '+', stylesheet[key], 'with', holder);
    var filter = key.replace(/#[0-9]+$/, '');
    if (filter[0] === '$' && filter[1] === '$') {
      holder = exports.render(stylesheet[key], holder);
    }
    else if (filter[0] === '$' && filter[1] !== '$' && filter[1] !== '?') {
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
exports.render = render;
