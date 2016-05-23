"use strict";

const json = require("./json");

module.exports = function(res) {
  return json(res, 401, "unauthorized");
};
