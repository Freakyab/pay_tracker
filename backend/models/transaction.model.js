const mongoose = require("mongoose");
const client = require("../config");

const TransactionSchema = new mongoose.Schema(
  {
    amount : {
      type: Number,
      required: true,
    },
    date : {
      type: Date,
      required: true,
    },
    description : {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category : {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = client.model("Transaction", TransactionSchema);
module.exports = Transaction;
