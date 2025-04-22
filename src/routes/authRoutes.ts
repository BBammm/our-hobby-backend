import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/Users'
import express, { Request, Response } from 'express'

const router = express.Router() // ✅ 반드시 Router로 생성!

// 🔐 회원가입

router.post('/register', async (req: any, res: any) => {
  const { email, password, nickname } = req.body

  // 1. 중복 검사
  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(400).json({ error: '이미 가입된 이메일입니다.' })
  }

  // 2. 비밀번호 암호화
  const hashed = await bcrypt.hash(password, 10)

  // 3. DB에 저장
  const newUser = new User({
    email,
    password: hashed,
    nickname,
  })

  await newUser.save()

  return res.status(201).json({ message: '회원가입 성공' })
})

// 🔑 로그인
router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ error: '이메일이 존재하지 않습니다.' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' })

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  res.json({ message: '로그인 성공', token })
})

export default router