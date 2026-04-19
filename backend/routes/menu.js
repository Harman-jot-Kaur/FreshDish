const express = require("express");
const { body, validationResult } = require("express-validator");
const MenuItem = require("../models/MenuItem");
const protect = require("../middleware/auth");
const { requirePermission } = require("../middleware/permissions");

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await MenuItem.find({ available: true }).sort({
    category: 1,
    name: 1,
  });
  res.json(items);
});

router.get("/categories", async (req, res) => {
  const categories = await MenuItem.distinct("category");
  res.json(categories);
});

router.post(
  "/",
  protect,
  requirePermission("manage_menu"),
  [
    body("name").notEmpty().withMessage("Name required"),
    body("category").notEmpty().withMessage("Category required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  },
);

router.put(
  "/:id",
  protect,
  requirePermission("manage_menu"),
  async (req, res) => {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  },
);

router.delete(
  "/:id",
  protect,
  requirePermission("manage_menu"),
  async (req, res) => {
    try {
      const item = await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      await item.deleteOne();
      res.json({ message: "Menu item removed" });
    } catch (error) {
      console.error("Delete menu item error:", error);
      res
        .status(500)
        .json({ message: "Server error while deleting menu item." });
    }
  },
);

module.exports = router;
