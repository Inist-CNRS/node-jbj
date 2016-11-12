/*jshint node:true,laxcomma:true */
'use strict';
var  url = require('url')
  , path = require('path')
  , fs = require('fs')
  , assert = require('assert')
  , debug = require('debug')('jbj')
  , debugRender = require('debug')('jbj:render')
  , debugInject = require('debug')('jbj:inject')
  , debugFetch = require('debug')('jbj:fetch')
  , waterfall = require('async-waterfall')
  , objectPath = require('object-path')
  , clone = require('clone')
  , JSON5 = require('json5')
  ;


var registry = {
  "file:" : function(urlObj, callback) {
    fs.readFile(path.resolve( process.cwd(), urlObj.host + urlObj.pathname), 'utf8', callback);
  }
};

exports.filters = {};

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

function isFilter(filterName) {
  return typeof exports.filters[filterName] === 'function'
}

function getActions() {
  return Object.keys(exports.filters);
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
  var inobj = clone(input)
  water.push(function(start) {
    start(null, inobj);
  });
  debugRender('keys :', Object.keys(stylesheet).join(','));
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
        debugRender('replace', filter, 'by', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
        render(params, holder, callback);
      }
      else if (filter[0] === '$' && filter[1] !== '$' && filter[1] !== '?') {
        debugRender('set', filter, 'by', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
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
      else if ((filter.toLowerCase() === 'assert' || filter.toLowerCase() === 'breakif') && isFilter(filter)) {
        debugRender('change', filter, 'by', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
        var r;
        try {
          if (holder instanceof Error) {
            callback(holder);
          }
          else {
            getFilter(filter)(holder, params, function(erro, resu) {
              if (inobj === holder) {
                holder = null;
              }
              if (resu === true) {
                return callback(null, holder);
              }
              else {
                return callback(new Error('stop'));
              }
            });
          }
        } catch(e) {
          e.message += filter ? " (" + filter + ")" : "";
          callback(e);
        }
      }
      else if (isFilter(filter)) {
        debugRender('exec', filter, 'with', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
        try {
          if (holder instanceof Error) {
            callback(holder);
          }
          else {
            getFilter(filter)(holder, params, function(erro, resu) {
              callback(erro === undefined ? null : erro, resu);
            });
          }
        } catch(e) {
          e.message += filter ? " (" + filter + ")" : "";
          callback(e);
        }
      }
      else {
        debugRender('go through', filter, ':', params);
        callback(null, holder);
      }
    });
  });

  waterfall(water,  function (err, result) {
    if (err === null || (err && err.message === 'stop')) {
      done(null, result);
    }
    else {
      debugRender('error', err.toString(), 'for', stylesheet);
      done(err);
    }
  });
}

function inject(stylesheet, input, done)
{
  if (!done) {
    done = input;
    input = null;
  }
  assert.equal(typeof stylesheet, 'object', 'Invalid JSON stylesheet');
  assert.equal(typeof done, 'function');


  var water = [];
  var inobj = clone(input);
  water.push(function(start) {
    start(null, {});
  });
  debugInject('keys :', Object.keys(stylesheet).join(','));
  Object.keys(stylesheet).forEach(function(key) {
    water.push(function(holder, callback) {
      // in case where prec filter return null
      if (callback === undefined) {
        callback = holder;
        holder = null;
      }
      var filter = key.replace(/#[0-9]+$/, '');
      var params = stylesheet[key];


      if (filter[filter.length - 1] === '<') {
        debugInject('render', filter, 'by', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
        render(params, input, function(err, res) {
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
            var path = filter.slice(0, -1);
            debugInject('fill', path, 'by', require('util').inspect(res, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
            objectPath.set(holder, path, res);
            callback(null, holder);
          }
        });
      }
      else if ((filter.toLowerCase() === 'assert' || filter.toLowerCase() === 'breakif') && isFilter(filter)) {
        debugInject('change', filter, 'by', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
        var r;
        try {
          if (holder instanceof Error) {
            callback(holder);
          }
          else {
            getFilter(filter)(holder, params, function(erro, resu) {
              if (inobj === holder) {
                holder = null;
              }
              if (resu === true) {
                return callback(null, holder);
              }
              else {
                return callback(new Error('stop'));
              }
            });
          }
        } catch(e) {
          e.message += filter ? " (" + filter + ")" : "";
          callback(e);
        }
      }
      else if (filter[0] === '<') {
        filter = filter.slice(1);
        if (isFilter(filter)) {
          debugInject('exec', filter, 'with', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
          try {
            if (holder instanceof Error) {
              callback(holder);
            }
            else {
              getFilter(filter)(holder, params, function(erro, resu) {
                callback(erro === undefined ? null : erro, resu);
              });
            }
          } catch(e) {
            e.message += filter ? " (" + filter + ")" : "";
            callback(e);
          }
        }
        else {
          debugInject('go through', filter, ':', params);
          callback(null, holder);
        }
      }
      else if (typeof params === 'object' && params !== null) {
        debugInject('recursive way for', filter, ':', Object.keys(params).join(','));
        inject(params, inobj, function(erro, resu) {
          if (erro) {
            callback(erro);
          }
          else {
            objectPath.set(holder, filter, resu);
            callback(null, holder);
          }
        })
      }
      else {
        debugInject('set', filter, 'with', require('util').inspect(params, { showHidden: false, depth:0, colors: true }).replace("\n", ' '));
        objectPath.set(holder, filter, params);
        callback(null, holder);
      }
    });
  });

  waterfall(water,  function (err, result) {
    if (err === null || (err && err.message === 'stop')) {
      done(null, result);
    }
    else {
      debugInject('error', err.toString(), 'for', stylesheet);
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



function register(protocol, callback) {
  assert.equal(typeof protocol, 'string');
  assert.equal(typeof callback, 'function');
  registry[protocol] = callback;
}

function fetch(url, callback) {
  debugFetch(url);
  var urlObj = url;
  if (typeof url === 'string') {
    urlObj = require('url').parse(url);
  }
  if (registry[urlObj.protocol] !== undefined) {
    registry[urlObj.protocol](urlObj, callback);
  }
  else {
    return callback(new Error('Unsupported protocol : `' + urlObj.protocol + '`'));
  }
}

function use(module) {
  assert.equal(typeof module, 'function');
  var newFilters = module(execargs, mapargs);
  Object.keys(newFilters).forEach(function(filterName) {
    exports.filters[filterName] = newFilters[filterName];
  });
}

function renderFile(filePath, options, callback) {
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

exports.render = render;
exports.inject = inject;
exports.fetch  = fetch;
exports.register = register;
exports.getActions = getActions;
exports.getFilter = getFilter;
exports.use = use;
exports.renderFile = renderFile

exports.use(require('./filters/basics.js'));
exports.use(require('./filters/ejs.js'));
