import express from "express";
import Transaction from "../models/transactionModel";

const router = express.Router();

// GET /api/transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/transactions
router.post("/", async (req, res) => {
  try {
    const { type, amount, date, note } = req.body;
    if (!type || !amount || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const transaction = new Transaction({ type, amount, date, note });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
