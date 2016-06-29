/*jshint node:true,laxcomma:true */
'use strict';
var  url = require('url')
  , path = require('path')
  , fs = require('fs')
  , assert = require('assert')
  , debug = require('debug')('jbj')
  , waterfall = require('async-waterfall')
  , objectPath = require('object-path')
  , JSON5 = require('json5')
  ;

exports.filters = {};

var registry = {
  "file:" : function(urlObj, callback) {
    fs.readFile(path.resolve( process.cwd(), urlObj.host + urlObj.pathname), 'utf8', callback);
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
 function getActions() {
   return Object.keys(exports.filters);
}



function fetch(urlStr, callback)
{
  assert.equal(typeof urlStr, 'string');
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
  debug('render', stylesheet, 'with', input);
  Object.keys(stylesheet).forEach(function(key) {
    water.push(function(holder, callback) {
      // in case where prec filter return null
      if (callback === undefined) {
        callback = holder;
        holder = null;
      }
      var filter = key.replace(/#[0-9]+$/, '');
      var params = stylesheet[key];


      if (filter[0] === '$' && filter[1] === '$') {
        debug('replace', filter, 'by', params);
        render(params, holder, callback);
      }
      else if (filter[0] === '$' && filter[1] !== '$' && filter[1] !== '?') {
        debug('set', filter, 'by', params);
        render(params, holder, function(err, res) {
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
      else if ((filter.toLowerCase() === 'assert' || filter.toLowerCase() === 'breakif') && typeof exports.filters[filter] === 'function') {
        debug('change', filter, 'by', params);
        var r;
        try {
          r = exports.filters[filter](holder, params);
        } catch(e) {
          e.message += filter ? " (" + filter + ")" : "";
          return callback(e);
        }

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
        debug('exec', filter, 'with', params);
        try {
          if (holder instanceof Error) {
            callback(holder);
          }
          else {
            var func = exports.filters[filter];
            if (func.length === 3) {
              func(holder, params, function(erro, resu) {
                callback(erro === undefined ? null : erro, resu);
              });
            }
            else {
              callback(null, func(holder, params));
            }
          }
        } catch(e) {
          e.message += filter ? " (" + filter + ")" : "";
          callback(e);
        }
      }
      else {
        debug('go through', filter, ':', params);
        callback(null, holder);
      }
    });
  });

  waterfall(water,  function (err, result) {
    if (err === null || (err && err.message === 'stop')) {
      done(null, result);
    }
    else {
      done(err);
    }
  });
}


function execargs(args, func, actionName) {
    return func(args);
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
exports.fetch = function(url, callback) {
  debug('fetch', url);
  var urlObj = require('url').parse(url);
  if (registry[urlObj.protocol] !== undefined) {
    registry[urlObj.protocol](urlObj, callback);
  }
  else {
    return callback(new Error('Unsupported protocol : `' + urlObj.protocol + '`'));
  }
}

exports.render = render;
exports.getActions = getActions;
exports.getFilter = getFilter;
exports.use = function (module) {
  assert.equal(typeof module, 'function');
  var newFilters = module(execargs, mapargs);
  Object.keys(newFilters).forEach(function(filterName) {
      exports.filters[filterName] = newFilters[filterName];
  });
};
exports.renderFile = function (filePath, options, callback) {
  debug('renderFile', filePath);
  fs.readFile(filePath, function (err, content) {
    if (err) {
      return callback(err);
    }
    try {
      return render(JSON5.parse(content), options, callback);
    }
    catch(e) {
      return callback(e);
    }
  });
}

exports.use(require('./filters/basics.js'));
exports.use(require('./filters/ejs.js'));
exports.use(require('./filters/template.js'));
