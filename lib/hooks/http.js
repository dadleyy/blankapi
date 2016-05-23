"use strict";

const express = require("express");
const http = require("../http");
const util = require("../util");
const body_parser = require("body-parser");

function factory(config, log, orm) {
  let app = express();
  let server = null;
  let session_engine = http.middleware.session(config);

  // register the session engine
  app.use(session_engine);

  // register body parsing engine
  app.use(body_parser.json());

  // inject application-level resources into the express
  // request so routes have access to them.
  function injection(req, res, next) {
    req.log = log;
    req.orm = orm;
    next();
  }

  app.use(injection);

  function listen(port) {
    port = port || config.http.port;
    log.info(`opening express http server on port[${port}]`);
    server = app.listen(port);
  }

  function close() {
    server.close();
  }

  function missing(req, res, next) {
    return http.responses.notFound(res);
  }
  
  // register routes
  app.use(http.routes.session);
  app.use(http.routes.users);

  app.use(missing);

  return util.defer.resolve({listen, close});
}

module.exports = function(define) {
  return define("http", ["config", "log", "orm"], factory);
};
