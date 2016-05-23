"use strict";

const json = require("./json");

module.exports = function(res, data) {
  return json(res, 422, data);
};

module.exports.sql = function(res, err) {
  let code = err.errno;
  let data = {};

  switch(code) {
    case 1062:
      data.message = "DUPLICATE";
      break;
    case 1146:
      data.message = "TABLE_NOT_FOUND";
      break;
    default:
      data.message = "GENERIC_ERROR";
      break;
  }

  return json(res, 422, data);
};
