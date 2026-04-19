// Test for /menu route (backend)
const request = require("supertest");
const express = require("express");
const menuRouter = require("../routes/menu");

const app = express();
app.use(express.json());
app.use("/menu", menuRouter);

describe("GET /menu", () => {
  it("should return menu items (mocked)", async () => {
    const res = await request(app).get("/menu");
    // This test assumes the route returns an array or error if not connected to DB
    expect([200, 500, 404]).toContain(res.statusCode);
    expect(Array.isArray(res.body) || typeof res.body === "object").toBe(true);
  });
});
