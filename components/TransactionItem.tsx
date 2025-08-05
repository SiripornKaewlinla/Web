'use client';
import { Transaction } from "@/types/transaction";

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  const date = transaction.date ? new Date(transaction.date).toLocaleDateString() : "ไม่ระบุวันที่";

  return (
    <div className="border p-4 rounded-md shadow-sm bg-white flex justify-between items-center">
      <div>
        <div className="font-semibold">{transaction.note || "ไม่ระบุ"}</div>
        <time className="text-sm text-gray-500" dateTime={transaction.date}>{date}</time>
      </div>
      <div className={`text-right ${transaction.type === "income" ? "text-green-600" : "text-red-500"}`}>
        {transaction.type === "income" ? "+" : "-"}฿{transaction.amount.toLocaleString()}
      </div>
    </div>
  );
}
