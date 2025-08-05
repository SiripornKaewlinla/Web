'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    // ตรวจสอบตอนสมัคร ว่ารหัสผ่านตรงกันหรือไม่
    if (mode === 'register' && password !== confirmPassword) {
      setMessage('รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const url =
        mode === 'login'
          ? 'http://localhost:5000/api/auth/login'
          : 'http://localhost:5000/api/auth/register';

      const bodyData =
        mode === 'login'
          ? { username, password }
          : { username, password, confirmPassword };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'เกิดข้อผิดพลาด');
        return;
      }

      setMessage(data.message);

      if (mode === 'login') {
        alert('ล็อกอินสำเร็จ!');
        localStorage.setItem('username', username);
        router.push('/');
      } else {
        setMode('login');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      console.error(error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">
            {mode === 'login' ? 'ชื่อผู้ใช้ (อีเมลหรือเบอร์โทร)' : 'อีเมล หรือ เบอร์โทร'}
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="กรอกอีเมล หรือ เบอร์โทร"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">รหัสผ่าน</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="กรอกรหัสผ่าน"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="block mb-1 font-semibold">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="กรอกยืนยันรหัสผ่าน"
            />
          </div>
        )}

        {message && <p className="text-red-600">{message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </button>
      </form>

      <p className="mt-4 text-center">
        {mode === 'login' ? (
          <>
            ยังไม่มีบัญชี?{' '}
            <button
              className="text-blue-600 underline"
              onClick={() => {
                setMessage('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setMode('register');
              }}
            >
              สมัครสมาชิก
            </button>
          </>
        ) : (
          <>
            มีบัญชีแล้ว?{' '}
            <button
              className="text-blue-600 underline"
              onClick={() => {
                setMessage('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setMode('login');
              }}
            >
              เข้าสู่ระบบ
            </button>
          </>
        )}
      </p>
    </div>
  );
}
