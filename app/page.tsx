'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import TransactionItem from '@/components/TransactionItem';
import { Transaction } from '@/types/transaction';

export default function HomePage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      setUsername(null);
    } else {
      setUsername(user);
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        cache: 'no-store',
      });
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("โหลดข้อมูลผิดพลาด", error);
    }
  };

  const handleStartListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      alert('เบราว์เซอร์ไม่รองรับ Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'th-TH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (e: any) => {
      console.error('Error:', e);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      alert(`คุณพูดว่า: ${transcript}`);
      // TODO: แปลง transcript เป็นข้อมูล แล้วส่งเพิ่มรายการใหม่
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      {/* เมนูล็อกอิน / สมัครสมาชิก */}
      <nav className="flex justify-end space-x-4 mb-4">
        {!username ? (
          <>
            <button
              onClick={() => router.push('/auth?mode=login')}
              className="text-blue-600 underline"
            >
              ล็อกอิน
            </button>
            <button
              onClick={() => router.push('/auth?mode=register')}
              className="text-blue-600 underline"
            >
              สมัครสมาชิก
            </button>
          </>
        ) : (
          <div className="text-gray-700">
            สวัสดี, <strong>{username}</strong>{" "}
            <button
              onClick={() => {
                localStorage.removeItem("username");
                setUsername(null);
                router.push('/auth');
              }}
              className="ml-3 text-red-500 underline"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </nav>

      <h1 className="text-2xl font-bold mb-4">📋 รายการรายรับ-รายจ่าย</h1>

      <div className="flex gap-4">
        <button
          onClick={handleStartListening}
          className={`px-4 py-2 rounded text-white ${isListening ? 'bg-red-500' : 'bg-green-600'} hover:opacity-90`}
        >
          {isListening ? '🎤 กำลังฟัง...' : '🎤 บันทึกด้วยเสียง'}
        </button>

        <button
          onClick={() => alert('ฟีเจอร์ OCR ยังไม่พร้อมใช้งาน')}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          🧾 สแกนใบเสร็จ (OCR)
        </button>
      </div>

      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <TransactionItem key={t._id} transaction={t} />
          ))
        ) : (
          <p className="text-gray-500">ยังไม่มีข้อมูล</p>
        )}
      </div>
    </main>
  );
}
