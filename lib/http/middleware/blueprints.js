"use strict";

const util = require("../../util");

const OPERATION_PARAM_RGX = /(in|gt|gte|lt|lte|eq|neq|lk)\((\S+)\)/

const OPERATIONS = {
  neq: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  lk: "like",
  eq: "="
};

module.exports = function blueprints(req, res, next) {
  let filters = req.query.filters;
  let max = parseInt(req.query.max, 10) || 100;
  let page = parseInt(req.query.page, 10) || 0;

  if(typeof filters !== "object")
    return next();

  function exec(model) {
    // prepare the bookshelf query object that we will be building off of
    let query = null;
    let cursor = model.query(function(qb) { query = qb; });
    let deferred = util.defer();

    function success(models) {
      let count = query.count("id as count");

      count.then(function(result) { 
        let count = result[0]["count"];
        deferred.resolve({models, count, page, max});
      });
    }

    function failed(e) {
      req.log.info("failed generating request model query");
      deferred.reject(e);
    }

    // loop over everything found in the express "filter" property of the `query` object 
    // which will be a json object made of key, value things with operation-like syntax
    for(let name in filters) {
      let value = filters[name];
      let op_match = OPERATION_PARAM_RGX.exec(value);

      // if this property's value did not look like an operation, e.g: 
      //
      // filters[id]=1
      //
      // then we should  just consider and equality
      if(!op_match) {
        req.log.debug(`no op found, attempting a direct equality for ${name}`);
        query.andWhere(name, "=", value)
        continue;
      }

      // from the matched `op(value)` syntax, extract the operation and the value
      let op = op_match[1];
      value = op_match[2];

      if(op === "in") {
        req.log.debug(`adding "in" query: ${value}`);
        value = value.split(",");
        query.whereIn(name, value);
        continue;
      }

      // for `like` requests 
      if(op === "lk")
        value = `%${value}%`;

      req.log.debug(`adding "${op}" query: ${value}`);
      query.andWhere(name, OPERATIONS[op], value);
    }

    cursor.fetchPage({limit: max, page: page})
      .then(success)
      .catch(failed);

    return deferred.promise;
  }

  req.blueprint = {exec};

  return next();
}

