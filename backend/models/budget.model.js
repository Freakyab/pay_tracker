const mongoose = require("mongoose");
const client = require("../config");

const BudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Budget = client.model("Budget", BudgetSchema);
module.exports = Budget;
