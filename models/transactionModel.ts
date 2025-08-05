import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  type: "income" | "expense";
  amount: number;
  date: Date;
  note?: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
export default Transaction;
