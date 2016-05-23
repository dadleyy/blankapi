"use strict"

require("dotenv").load();
const hooks = require("./lib/hooks");
let config = hooks.config.create();

let db_config = {
  client: "mysql",
  connection: {
    host: config.db.hostname,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database
  }
};

module.exports = {
  production: db_config,
  development: db_config
};
