import express from 'express';
import * as bcrypt from 'bcrypt';
import User from '../models/userModel';

const router = express.Router();

// สมัครสมาชิก
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, passwordHash });
  await newUser.save();

  res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
});

// เข้าสู่ระบบ
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

  res.json({ message: 'ล็อกอินสำเร็จ', token: 'dummy-token' });
});

export default router;
