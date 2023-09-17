import chai from 'chai';
import chaiHttp from 'chai-http';
import app from "../index.js";

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Login Tests", () => {

  // register user
  describe("POST /api/auth/register", () => {
    it("register user", (done) => {
      chai.request(app).post("/api/auth/register").send({
        username: "test",
        password: "123456",
      }).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        res.body.should.have.property("message").eq("User has been created.");
        done();
    });
    });
  });

  //reset user before test
  describe("POST /api/auth/reset", () => {
    it("login reset before test", (done) => {
      chai.request(app).post("/api/auth/reset").send({
        username: "test",
      })
      .end((err, res) => {
        if (err) throw err;
        res.should.have.status(200);
        res.body.should.have.property("message");
        res.body.should.have.property("message").eq("reset success!");
        done();
      });
    });
  });

  //user login successful
  describe("POST /api/auth/login", () => {
    it("success login", (done) => {
      chai.request(app).post("/api/auth/login").send({
        username: "test",
        password: "123456",
      }).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message");
        res.body.should.have.property("message").eq("success!");
        done();
      });
    });
  });

  //user login unsuccessful
  describe("POST /api/auth/login", () => {
    it("incorrect password", (done) => {
      chai.request(app).post("/api/auth/login").send({
        username: "test",
        password: "12345677",
      }).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("message");
        res.body.should.have.property("message").eq("fail! username and password are not matched");
        done();
    });
    });
  });

  //user login unsuccessful 3 times within 5 mins, lock user
  describe("POST /api/auth/login", () => {
    it("3 times login fail then lock user", (done) => {
      let failedAttempts = 0;
      function attemptLogin() {
        chai
          .request(app)
          .post("/api/auth/login")
          .send({
            username: "test",
            password: "1234567",
          })
          .end((err, res) => {
            if (failedAttempts < 3) {
              res.should.have.status(404);
              res.body.should.have.property("message");
              res.body.should.have.property("message").eq("fail! username and password are not matched");
              failedAttempts++;
              attemptLogin(); // Try logging in again
            } else {
              // If login fails 3 times, expect status 408 (lock user)
              res.should.have.status(404);
              res.body.should.have.property("message");
              res.body.should.have.property("message").eq("fail! User was locked");
              done(); // Finish the test
            }
          });
      }
      // Start the login attempts
      attemptLogin();
    });
  });
});
