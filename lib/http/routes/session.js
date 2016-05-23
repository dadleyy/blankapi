"use strict";

const express = require("express");
const crypto = require("crypto");
const responses = require("../responses");

let engine = express();

function lookup(req, res) {
  let user_id = req.session.user;

  if(!user_id)
    return responses.unauthorized(res);

  function missing() {
    return responses.unauthorized(res);
  }

  function found(user) {
    return responses.ok(res, user);
  }

  req.orm.User.where({id: user_id})
    .fetch().then(found).catch(missing);
}

function create(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  if(!password || !email)
    return responses.unauthorized(res);

  // hash the password
  password = crypto.createHash("md5")
    .update(password).digest().toString("hex");

  function found(user) {
    console.log(arguments);
    let match = user && (user.get("password") === password);
    if(!match) return responses.unauthorized(res);

    req.log.debug(`found user, saving to session`);
    req.session.user = user.id;
    return responses.ok(res, true);
  }

  function missing(err) {
    req.log.info(`not found: ${err}`);
    return responses.unauthorized(res);
  }

  req.log.debug(`searching for user [${email}] with password[${password}]`);

  req.orm.User.where("email", "=", email)
    .fetch().then(found).catch(missing);
}

function destroy(req, res) {
  req.session.user = null;
  return responses.ok(res, true);
}

engine.get("/session", lookup);
engine.post("/session", create);
engine.delete("/session", destroy);

module.exports = engine;
