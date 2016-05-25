/*jshint node:true,laxcomma:true */
'use strict';
var  url = require('url')
  , fs = require('fs')
  , assert = require('assert')
  , async = require('async')
  , debug = /* console.log  // */ function() { /* noop */ }
  , objectPath = require('object-path');

exports.filters = {};

var registry = {
  "file:" : function(urlObj, callback) {
    fs.readFile(urlObj.pathname, 'utf8', callback);
  }
};
function getFilter(filterName) {
  if (exports.filters[filterName] === undefined) {
    throw new Error('unknown filter : `' + filterName + '`');
  }
  return function(filterInput, filterStylesheet, filterCallback) {
      if (filterCallback === undefined) {
        filterCallback = filterStylesheet;
      }
      var filterFunc = exports.filters[filterName];
      if (filterFunc.length === 3) {
        filterFunc(filterInput, filterStylesheet, filterCallback);
      }
      else {
        filterCallback(null, filterFunc(filterInput, filterStylesheet));
      }
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
    else if (holder instanceof Error && typeof exports.filters[filter] === 'function') {
      console.error(holder);
    }
    else if ((filter.toLowerCase() === 'assert' || filter.toLowerCase() === 'breakif') && typeof exports.filters[filter] === 'function') {
      var r = exports.filters[filter](holder, stylesheet[key]);
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
    else if (typeof exports.filters[filter] === 'function') {
      holder = exports.filters[filter](holder, stylesheet[key]);
      debug('exec', filter, ':', stylesheet[key], '=', holder);
    }
    return true;
  });
  return holder;

}


function render(stylesheet, input, done)
{
  if (!done) {
    done = input;
    input = null;
  }
  assert.equal(typeof stylesheet, 'object', 'Invalid JSON stylesheet');
  assert.equal(typeof done, 'function');

  var water = [];
  water.push(function(start) {
    start(null, input);
  });
  debug('render', stylesheet);
  Object.keys(stylesheet).forEach(function(key) {
    water.push(function(holder, callback) {
      // in case where prec filter return null
      if (callback === undefined) {
        callback = holder;
        holder = null;
      }
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
      else if ((filter.toLowerCase() === 'assert' || filter.toLowerCase() === 'breakif') && typeof exports.filters[filter] === 'function') {
        var r = exports.filters[filter](holder, stylesheet[key]);
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
      else if (typeof exports.filters[filter] === 'function') {
        if (holder instanceof Error) {
          callback(holder);
        }
        else {
          var func = exports.filters[filter];
          if (func.length === 3) {
            func(holder, stylesheet[key], callback);
          }
          else {
            callback(null, func(holder, stylesheet[key]));
          }
        }
        debug('exec', filter, ':', stylesheet[key]);
      }
      else {
        callback(null, holder);
      }
    });
  });

  async.waterfall(water,  function (err, result) {
    if (err === null || (err && err.message === 'stop')) {
      done(null, result);
    }
    else {
      done(err);
    }
  });
}


function execargs(args, func, actionName) {
  try {
    return func(args);
  }
  catch(e) {
    e.message += actionName ? " (" + actionName + ")" : "";
    return e;
  }
}

function mapargs(args, func, actionName) {
  if (Array.isArray(args)) {
    return args.map(function(i) {
        try {
          return func(i);
        }
        catch(e) {
          e.message += actionName ? " (" + actionName + ")" : "";
          return e;
        }
    }).filter(function(i) {
        return (i !== '' && i !== undefined && i !== null);
    });
  }
  else {
    return execargs(args, func, actionName);
  }
}



exports.register = function (protocol, callback) {
  assert.equal(typeof protocol, 'string');
  assert.equal(typeof callback, 'function');
  registry[protocol] = callback;
};
exports.render = render;
exports.renderSync = renderSync;
exports.getFilter = getFilter;
exports.use = function (module) {
  assert.equal(typeof module, 'function');
  var newFilters = module(execargs, mapargs);
  Object.keys(newFilters).forEach(function(filterName) {
      exports.filters[filterName] = newFilters[filterName];
  });
};

exports.use(require('./filters/basics.js'));
exports.use(require('./filters/ejs.js'));
