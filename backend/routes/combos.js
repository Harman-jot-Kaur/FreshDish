const express = require("express");
const router = express.Router();
const Combo = require("../models/Combo");
const MenuItem = require("../models/MenuItem");

// Get all combos
router.get("/", async (req, res) => {
  try {
    const combos = await Combo.find().populate("items");
    res.json(combos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new combo (admin only, simple version)
router.post("/", async (req, res) => {
  try {
    const { name, description, items, price, image } = req.body;
    const combo = new Combo({ name, description, items, price, image });
    await combo.save();
    res.status(201).json(combo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
