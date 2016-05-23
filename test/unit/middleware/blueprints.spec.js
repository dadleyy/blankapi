const chai = require("chai");
const lib = require("../../../lib");

describe("blueprints test suite", function() {

  var app = null;
  var mock_log;

  function noop() { }

  before(function(done) {
    lib.make([]).then(function(result) {
      app = result;
      done();
    });

    mock_log = {info: noop, debug: noop};
  });

  describe("with the user model seeded with 4 records", function() {

    var instance = null;
    var filters = {};
    var request = {};
    var result = null;
    var query = {};

    function next(fn) {
    }

    before(function(done) {
      function seed() {
        app.orm.knex("users").insert([{
          email: "adam@testing.com",
          username: "atest",
          id: 1,
          password: "unhashed"
        }, {
          email: "billy@testing.com",
          username: "btest",
          id: 2,
          password: "unhashed"
        }, {
          email: "jason@testing.com",
          username: "jtest",
          id: 3,
          password: "unhashed"
        }, {
          email: "keith@testing.com",
          username: "ktest",
          id: 4,
          password: "unhashed"
        }]).then(function() { done(); });
      }

      app.orm.knex("users")
        .where("id", ">", 0)
        .del().then(seed);
    });

    before(function() {
      filters = {};
      request = {};
      query = {};
      result = null;

      query.filters = {};

      request.orm = app.orm;
      request.query = query;
      request.log = mock_log;
    });

    describe("executing", function() {

      it("should have bound an `exec` function to the request object", function() {
        lib.http.middleware.blueprints(request, null, next);
        chai.expect(typeof request.blueprint.exec).to.equal("function");
      });

      describe("with \"filters[id]=lt(2)\"", function() {


        before(function(done) {
          query.filters.id = "lt(2)";

          lib.http.middleware.blueprints(request, null, next);

          request.blueprint.exec(app.orm.User)
            .then(function(r) {
              result = r;
              done();
            });
        });

        it("should return count === 1", function() {
          chai.expect(result.count).to.equal(1);
        });

        it("should have the adam seed", function() {
          var first = result.models.toJSON()[0];
          chai.expect(first.id).to.equal(1);
        });

      });

      describe("with \"filters[id]=3\"", function() {


        before(function(done) {
          query.filters.id = "3";

          lib.http.middleware.blueprints(request, null, next);

          request.blueprint.exec(app.orm.User)
            .then(function(r) {
              result = r;
              done();
            });
        });

        it("should return count === 1", function() {
          chai.expect(result.count).to.equal(1);
        });

        it("should have the jason seed", function() {
          var first = result.models.toJSON()[0];
          chai.expect(first.id).to.equal(3);
        });

      });

      describe("with \"filters[id]=gt(3)\"", function() {


        before(function(done) {
          query.filters.id = "gt(3)";

          lib.http.middleware.blueprints(request, null, next);

          request.blueprint.exec(app.orm.User)
            .then(function(r) {
              result = r;
              done();
            });
        });

        it("should return count === 1", function() {
          chai.expect(result.count).to.equal(1);
        });

        it("should have the keith seed", function() {
          var first = result.models.toJSON()[0];
          chai.expect(first.id).to.equal(4);
        });

      });

    });

  });

});
