"use strict";

const ok = require("./ok");
const notFound = require("./notFound");
const badRequest = require("./badRequest");
const notImplemented = require("./notImplemented");
const unauthorized = require("./unauthorized");
const serverError = require("./unauthorized");

module.exports = {
  serverError, notImplemented, unauthorized, ok, badRequest, notFound
};
