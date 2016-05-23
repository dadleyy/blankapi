"use strict";

const express = require("express");
const crypto = require("crypto");

const responses = require("../responses");
const app = express();
const middleware = require("../middleware");

function create(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;

  if(!password || !email || !username) {
    return responses.badRequest(res, "MISSING_INFO");
  }

  // hash the password
  password = crypto.createHash("md5")
    .update(password).digest().toString("hex");

  function success(user) {
    responses.ok(res, user);
  }

  function fail(err) {
    req.log.info(`failed creating user with code ${err.errno}`);
    responses.badRequest.sql(res, err);
  }

  let user = new req.orm.User({email, password, username});
  user.save().then(success).catch(fail);
}

function find(req, res) {
  function found(result) {
    let pagination = {per_page: result.max, available: result.count, page: result.page};
    return responses.ok(res, result.models.toJSON(), {pagination});
  }

  function failed() {
    return responses.badRequest(res);
  }

  req.blueprint.exec(req.orm.User)
    .then(found).catch(failed);
}

function update(req, res) {
  return responses.notImplemented(res);
}

app.get("/users", middleware.authenticated, middleware.blueprints, find);
app.post("/users", create);
app.patch("/users/:id", middleware.authenticated, update);

module.exports = app;
