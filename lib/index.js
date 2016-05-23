"use strict"

const models = require("./models");
const hooks = require("./hooks");
const util = require("./util");
const http = require("./http");

function make(user_hooks) {
  let deferred = util.defer();
  let app = {};

  let _hooks = [
    hooks.config,
    hooks.log,
    hooks.orm
  ];

  if(user_hooks instanceof Array)
    _hooks = _hooks.concat(user_hooks);

  function finished() {
    deferred.resolve(app);
  }

  function use(dependencies, factory) {
    let inject = [];
    let dc = dependencies.length;

    for(let i = 0; i < dc; i++) {
      let name = dependencies[i];
      let dependency = app.hasOwnProperty(name) ? app[name] : null;

      if(!dependency)
        return util.defer.reject(new Error(`Module ${name} not found while building injection`));

      inject.push(dependency);
    }

    return factory.apply(null, inject);
  }

  function define(name, dependencies, factory) {
    let exists = app.hasOwnProperty(name);

    if(exists)
      return util.defer.reject(new Error(`Module ${name} already loaded`));

    function loaded(result) {
      app[name] = result;
      return result;
    }

    return use(dependencies, factory)
      .then(loaded);
  }

  function loadHook(hook) {
    return hook(define, use);
  }

  util.defer.each(_hooks, loadHook)
    .then(finished)
    .catch(deferred.reject);

  return deferred.promise;
}

module.exports = {models, make, hooks, http};
