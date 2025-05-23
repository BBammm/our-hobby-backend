import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!)
    console.log('✅ MongoDB 연결 성공')
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error)
    process.exit(1)
  }
}