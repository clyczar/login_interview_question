const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index.js");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGOURL);
});

describe("POST /api/auth/login", () => {
  test("login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "test",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("test");
  });
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});
