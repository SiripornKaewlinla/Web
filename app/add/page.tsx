'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTransactionPage() {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount: +amount, date, note }),
    });
    router.push("/");
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">➕ เพิ่มรายการใหม่</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md shadow">
        <div>
          <label className="block font-medium mb-1">ประเภท</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="income">รายรับ</option>
            <option value="expense">รายจ่าย</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">จำนวนเงิน (บาท)</label>
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">วันที่</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">หมายเหตุ</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          บันทึก
        </button>
      </form>
    </main>
  );
}
