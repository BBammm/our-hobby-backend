import express from 'express'
import { Hobby } from '../models/Hobby'
import { ApiError } from '../lib/error/ApiError'

const router = express.Router()

// ✅ GET 전체 취미 리스트
router.get('/', async (req, res, next) => {
  try {
    const hobbies = await Hobby.find()
    res.json(hobbies)
  } catch (err) {
    next(err)
  }
})

// ✅ POST 새로운 취미 등록
router.post('/', async (req, res, next) => {
  try {
    const { name, tagId, description, locationType, location } = req.body

    if (!name || !tagId || !description || !locationType || !location) {
      throw new ApiError(400, '필수 항목이 누락되었습니다.')
    }

    const hobby = new Hobby({
      name,
      tag: tagId,
      description,
      locationType,
      location,
    })

    await hobby.save()
    res.status(201).json({ message: '모임이 저장되었습니다.' })
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new ApiError(422, '입력값이 유효하지 않습니다.'))
    }
    next(err)
  }
})

// ✅ GET 단일 취미 조회
router.get('/:id', async (req, res, next) => {
  try {
    const hobby = await Hobby.findById(req.params.id)
    if (!hobby) throw new ApiError(404, '해당 취미를 찾을 수 없습니다.')
    res.json(hobby)
  } catch (err) {
    next(err)
  }
})

export default router