"use strict";

const session = require("express-session");
const RedisSession = require("connect-redis");

module.exports = function(config) {
  let RedisStore = RedisSession(session);

  let session_key = config.lookup("session.key") || "bcapi";
  let redis_host = config.lookup("session.host") || "0.0.0.0";
  let redis_port = config.lookup("session.port") || 6379;

  // create our new session engine
  let session_engine = session({
    store: new RedisStore({host: redis_host, port: redis_port}),
    secret: session_key,
    resave: false,
    saveUninitialized: false
  });

  return session_engine;
}
