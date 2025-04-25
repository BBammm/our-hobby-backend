import { Request, Response, NextFunction } from 'express'
import { ApiError } from './ApiError'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500
  const message = err.message || '알 수 없는 서버 오류가 발생했습니다.'

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, message)

  res.status(statusCode).json({ error: message })
}