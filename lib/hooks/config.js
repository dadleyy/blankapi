"use strict";

const util = require("../util");
const rc = require("rc");

const defaults = {
  port: 8080,
  log: {
    level: "debug",
    method: "console"
  }
};

function create() {
  let config = rc("bcapi", defaults);

  config.lookup = function(path) {
    let parts = path.split(".");
    let head = config;

    while(parts.length && head) {
      let next = parts.shift();
      head = head[next];
    }

    return head;
  }

  return config;
}

module.exports = function(define) {
  function factory() { return util.defer.resolve(create()); }
  return define("config", [], factory);
};

module.exports.create = create;
