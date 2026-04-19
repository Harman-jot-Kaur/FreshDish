const mongoose = require("mongoose");

const rolePermissions = {
  customer: [],
  admin: ["manage_menu", "manage_orders", "view_admin"],
  kitchen: ["manage_orders"],
  manager: ["manage_orders", "view_admin"],
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "admin", "kitchen", "manager"],
    default: "customer",
  },
  permissions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  if (!Array.isArray(this.permissions) || this.permissions.length === 0) {
    this.permissions = rolePermissions[this.role] || [];
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
