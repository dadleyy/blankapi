"use strict";

const knex = require("knex");
const bookshelf = require("bookshelf");
const util = require("../util");
const models = require("../models");

function factory(config) {
  let db_config = {
    client: "mysql",
    connection: {
      host: config.db.hostname,
      user: config.db.username,
      password: config.db.password,
      database: config.db.database
    }
  };

  let connection = knex(db_config);
  let shelf      = bookshelf(connection);
  let orm        = {};

  shelf.plugin("pagination");

  function without(attributes, blacklist) {
    var result = {};

    for(let name in attributes) {
      const blacklisted = blacklist.indexOf(name) !== -1;
      if(blacklisted) continue;
      result[name] = attributes[name];
    }

    return result;
  }

  function mount(model) {
    let proto = {
      tableName: model.config.table,
      hasTimestamps: model.config.timestamps
    };
    let hidden = model.config.hidden;

    proto.toJSON = function() {
      let attributes = this.attributes;
      if(hidden && hidden.length) attributes = without(attributes, hidden);
      return attributes;
    };

    return shelf.Model.extend(proto);
  }

  for(let name in models) {
    if(!models.hasOwnProperty(name)) continue;
    orm[name] = mount(models[name]);
  }

  orm.knex = connection;

  return util.defer.resolve(orm);
}

module.exports = function(define) {
  return define("orm", ["config"], factory);
};
