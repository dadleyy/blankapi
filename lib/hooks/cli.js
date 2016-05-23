"use strict";

const util = require("../util");
const http = require("./http");

module.exports = function(define, use) {
  let program = require("commander");
  let _config = null;

  function cli(config, logger) {
    _config = config;

    function run(argv) {
      program.parse(argv);
    }

    return util.defer.resolve({run});
  }

  function serve(cmd) {
    let port = cmd.port || _config.port;

    function listen(http) { http.listen(port); }

    function failed(e) {
      console.error(`Unable to lift http server, exiting. ${e.message}`);
      process.exit(1);
    }

    http(define).then(listen).catch(failed);
  }

  program.command("serve")
    .option("-p, --port [port]", "the port")
    .action(serve);

  return define("cli", ["config", "log"], cli);
};
