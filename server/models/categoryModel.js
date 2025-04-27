const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["fund", "cost"],
        message:
          '{VALUE} is not a valid type. Allowed types are "fund" or "cost".',
      },
    },
    money: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
