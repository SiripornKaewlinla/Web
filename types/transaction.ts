export type TransactionType = "income" | "expense";

export interface Transaction {
  _id?: string;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
}
