import express from 'express'
import { Tag } from '../models/Tag'

const router = express.Router()

// 🔍 자동완성용 태그 목록 (쿼리로 검색)
router.get('/', async (req, res) => {
  const query = req.query.q || ''
  const regex = new RegExp(String(query), 'i') // 'i'는 대소문자 무시
  const tags = await Tag.find({ name: regex }).limit(10)
  res.json(tags)
})

router.post('/', async (req: any, res: any) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: '태그 이름이 필요합니다.' })

  const existing = await Tag.findOne({ name })
  if (existing) return res.json(existing)

  const tag = new Tag({ name })
  await tag.save()
  res.status(201).json(tag)
})

export default router