require("dotenv").config();
const chai = require("chai");
const request = require("supertest");
const app = require("../server"); // server.js must have: module.exports = app

const expect = chai.expect;

describe("Auth API Tests", () => {
  const user = { username: "testuser123", password: "pass12345" };

  it("Register user (or user already exists)", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect([201, 409]).to.include(res.status);
  });

  it("Login should return token", async () => {
    const res = await request(app).post("/api/auth/login").send(user);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });
});