const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  subCategory: { type: String, trim: true },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, default: true },
  image: { type: String, default: "" },
  tags: [{ type: String }],
  popular: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
