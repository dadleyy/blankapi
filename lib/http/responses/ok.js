"use strict";

const json = require("./json");

module.exports = function(res, data, meta) {
  return json(res, 200, data, meta);
};

