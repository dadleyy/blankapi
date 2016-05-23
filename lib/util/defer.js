"use strict";

const bluebird = require("bluebird");

function defer() {
  let deferred = {};

  deferred.promise = new bluebird(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}

defer.each = function(arr, fn) {
  return bluebird.each(arr, fn);
};

defer.map = function(arr, fn, opts) {
  return bluebird.map(arr, fn, opts);
};

defer.reject = function(err) { return bluebird.reject(err); }
defer.resolve = function(err) { return bluebird.resolve(err); }

module.exports = defer;
