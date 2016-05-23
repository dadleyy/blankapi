"use strict";

const json = require("./json");

module.exports = function(res, message) {
  return json(res, 500, {message: message});
};
