// Unit test for User model (permissions logic)
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");

describe("User Model", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should assign default permissions based on role", async () => {
    const user = new User({
      name: "Test Admin",
      email: "admin@example.com",
      password: "password",
      role: "admin",
    });
    await user.save();
    expect(user.permissions).toEqual(
      expect.arrayContaining(["manage_menu", "manage_orders", "view_admin"]),
    );
  });

  it("should assign empty permissions for customer", async () => {
    const user = new User({
      name: "Test Customer",
      email: "customer@example.com",
      password: "password",
      role: "customer",
    });
    await user.save();
    expect(user.permissions).toEqual([]);
  });
});
