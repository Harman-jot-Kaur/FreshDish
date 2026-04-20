const express = require("express");
const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const protect = require("../middleware/auth");
const { requirePermission } = require("../middleware/permissions");

const router = express.Router();

// Admin: get all orders
router.get(
  "/",
  protect,
  requirePermission("manage_orders"),
  async (req, res) => {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  },
);

// Kitchen staff: get all orders to process
router.get(
  "/kitchen",
  protect,
  requirePermission("manage_orders"),
  async (req, res) => {
    const orders = await Order.find({
      status: { $in: ["pending", "preparing"] },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  },
);
router.post(
  "/",
  protect,
  [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Cart must contain at least one item"),
    body("deliveryMethod")
      .isIn(["pickup", "delivery"])
      .withMessage("Valid delivery method required"),
    body("timeSlot").notEmpty().withMessage("Time slot required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { items, deliveryMethod, address, timeSlot } = req.body;
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem)
        return res.status(404).json({ message: "Menu item not found" });
      const price = menuItem.price;
      total += price * item.quantity;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price,
        addOns: item.addOns || [],
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      deliveryMethod,
      address: deliveryMethod === "delivery" ? address || "" : "",
      timeSlot,
    });

    res.status(201).json(order);
  },
);

router.get("/mine", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.menuItem");
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (
    order.user.toString() !== req.user._id.toString() &&
    !["admin", "kitchen", "manager"].includes(req.user.role)
  ) {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(order);
});

router.put(
  "/:id/status",
  protect,
  requirePermission("manage_orders"),
  async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const { status } = req.body;
    if (
      !["pending", "preparing", "ready", "completed", "cancelled"].includes(
        status,
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }
    order.status = status;
    await order.save();
    res.json(order);
  },
);

router.put("/:id/feedback", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }
  const { feedback } = req.body;
  if (typeof feedback !== "string") {
    return res.status(400).json({ message: "Feedback must be text" });
  }
  order.customerFeedback = feedback;
  await order.save();
  res.json(order);
});

module.exports = router;
