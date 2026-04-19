const adminOnly = (req, res, next) => {
  if (!req.user || !["admin", "kitchen"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }
  next();
};

module.exports = adminOnly;
