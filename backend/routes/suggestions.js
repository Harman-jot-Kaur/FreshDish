const express = require("express");
const MenuItem = require("../models/MenuItem");
const Combo = require("../models/Combo");
const router = express.Router();

router.get("/", async (req, res) => {
  const popular = await MenuItem.find({ popular: true, available: true }).limit(
    6,
  );
  // Fetch all combos from Combo collection
  const combos = await Combo.find();
  res.json({
    popular,
    combos,
    message: "Try our chef recommendations and add-ons for your order.",
  });
});

module.exports = router;
