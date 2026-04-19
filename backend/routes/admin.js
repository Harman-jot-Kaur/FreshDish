const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/auth");
const { requirePermission } = require("../middleware/permissions");

const router = express.Router();

router.get(
  "/orders",
  protect,
  requirePermission("view_admin"),
  async (req, res) => {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  },
);

router.get(
  "/stats",
  protect,
  requirePermission("view_admin"),
  async (req, res) => {
    const orderCount = await Order.countDocuments();
    const pendingCount = await Order.countDocuments({ status: "pending" });
    const readyCount = await Order.countDocuments({ status: "ready" });
    const completedCount = await Order.countDocuments({ status: "completed" });
    res.json({ orderCount, pendingCount, readyCount, completedCount });
  },
);

module.exports = router;
