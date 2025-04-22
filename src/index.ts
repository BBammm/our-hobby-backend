import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db'
import hobbyRoutes from './routes/hobbyRoutes'
import authRoutes from './routes/authRoutes'

// 환경변수 불러오기 (.env 파일)
dotenv.config()

// express 앱 초기화
const app = express()
const PORT = Number(process.env.PORT) || 4000

// 미들웨어 설정
app.use(
  cors({
    origin: 'http://localhost:3000', // 프론트 주소 (정확하게 지정)
    credentials: true,
  })
)
app.use(express.json()) // JSON body 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.send('우리의 취미 서버입니다! 🎯')
})

// 취미 API 라우터 등록
app.use('/api/hobbies', hobbyRoutes)
app.use('/api/auth', authRoutes)

// DB 연결 후 서버 시작
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
})