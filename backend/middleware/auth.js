const jwt = require("jsonwebtoken");
const User = require("../models/User");

const rolePermissions = {
  customer: [],
  admin: ["manage_menu", "manage_orders", "view_admin"],
  kitchen: ["manage_orders"],
  manager: ["manage_orders", "view_admin"],
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    if (
      !Array.isArray(req.user.permissions) ||
      req.user.permissions.length === 0
    ) {
      req.user.permissions = rolePermissions[req.user.role] || [];
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
