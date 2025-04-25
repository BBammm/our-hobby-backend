import express from 'express'
import { Tag } from '../models/Tag'
import { ApiError } from '../lib/error/ApiError'

const router = express.Router()

// ✅ 태그 자동완성 또는 인기 태그 조회
router.get('/', async (req: any, res: any, next) => {
  try {
    const query = req.query.q

    if (query) {
      const regex = new RegExp(String(query), 'i')
      const tags = await Tag.find({ name: regex }).limit(10)
      return res.json(tags)
    }

    const tags = await Tag.find().sort({ createdAt: -1 }).limit(10)
    res.json(tags)
  } catch (err) {
    next(err)
  }
})

// ✅ 태그 등록
router.post('/', async (req: any, res: any, next) => {
  try {
    const { name } = req.body
    if (!name) throw new ApiError(400, '태그 이름이 필요합니다.')

    const existing = await Tag.findOne({ name })
    if (existing) return res.json(existing)

    const tag = new Tag({ name })
    await tag.save()
    res.status(201).json(tag)
  } catch (err) {
    next(err)
  }
})

export default router