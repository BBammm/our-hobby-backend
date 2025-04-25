import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/Users'
import express from 'express'
import { ApiError } from '../lib/error/ApiError'

const router = express.Router()

// 🔐 회원가입
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body

    if (!email || !password || !nickname) {
      throw new ApiError(400, '모든 항목을 입력해주세요.')
    }

    const existing = await User.findOne({ email })
    if (existing) {
      throw new ApiError(409, '이미 가입된 이메일입니다.')
    }

    const hashed = await bcrypt.hash(password, 10)

    const newUser = new User({ email, password: hashed, nickname })
    await newUser.save()

    res.status(201).json({ message: '회원가입 성공' })
  } catch (err) {
    next(err)
  }
})

// 🔑 로그인
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, '이메일과 비밀번호를 모두 입력해주세요.')
    }

    const user = await User.findOne({ email })
    if (!user) throw new ApiError(401, '이메일이 존재하지 않습니다.')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new ApiError(401, '비밀번호가 일치하지 않습니다.')

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

    res.json({ message: '로그인 성공', token })
  } catch (err) {
    next(err)
  }
})

export default router
