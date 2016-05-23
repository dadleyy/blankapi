"use strict";

const responses = require("../responses");
const blueprints = require("./blueprints");
const session = require("./session");

function authenticated(req, res, next) {
  if(!req.session) return responses.serverError(res, "SESSION");
  let user = req.session ? req.session.user : false;
  if(!user) return responses.unauthorized(res);
  next();
}

module.exports = {session, authenticated, blueprints};
