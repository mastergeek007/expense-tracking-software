const mongoose = require("mongoose");

const CostSchema = new mongoose.Schema({
  user: { type: String, required: true },
  money: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Cost", CostSchema);