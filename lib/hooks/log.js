"use strict";

const fs = require("fs");
const path = require("path");
const winston = require("winston");
const util = require("../util");

function factory(config) {
  const ConsoleTransport = winston.transports.Console;
  const FileTransport = winston.transports.File;

  let deferred   = util.defer();
  let transports = [];

  // get references to the log method and level
  let method   = config.log && config.log.method ? config.log.method : "console";
  let level    = config.log && config.log.level ? config.log.level : "info";
  let log_file = config.log && config.log.file ? config.log.file : false;

  function formatter(options) {
    let time = util.moment.format(null, "YYYY-MM-DD hh:mm:ss");
    return `[${options.level}] [${time}] ${options.message ? options.message : ''}`;
  }

  function factory() {
    return util.defer.resolve(new winston.Logger(config));
  }

  if(method === "console") {
    transports = [new ConsoleTransport({formatter})];
    return util.defer.resolve(new winston.Logger({transports, level}));
  }

  let logdir = path.dirname(log_file);

  fs.stat(logdir, function(err, stats) {
    if(err) 
      return deferred.reject(err);

    let is_dir = stats.isDirectory();

    if(!is_dir)
      return deferred.reject(new Error("LOG_FILE's directory must exist and be writable to"));

    let transport = new FileTransport({
      json: false, 
      filename: log_file,
      formatter: formatter
    });

    transports = [transport];
    deferred.resolve(new winston.Logger({transports, level}));
  });

  return deferred.promise;
}

module.exports = function(define) {
  return define("log", ["config"], factory);
};
