const rolePermissions = {
  customer: [],
  admin: ["manage_menu", "manage_orders", "view_admin"],
  kitchen: ["manage_orders"],
  manager: ["manage_orders", "view_admin"],
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const permissions = Array.isArray(req.user.permissions)
      ? req.user.permissions
      : rolePermissions[req.user.role] || [];
    if (permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Permission required" });
  };
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Role required" });
  };
};

module.exports = { requirePermission, requireRole };
