import express from 'express'
import { Hobby } from '../models/Hobby'
import { ApiError } from '../lib/error/ApiError'
import mongoose from 'mongoose'

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
    const { name, tagId, description, locationType, location, creator } = req.body

    if (!name || !tagId || !description || !locationType || !location || !creator) {
      throw new ApiError(400, '모든 항목을 입력해주세요.')
    }

    const hobby = new Hobby({
      name,
      tag: tagId,
      description,
      locationType,
      location,
      creator, // ✅ 사용자 ID 저장
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

router.get('/mine', async (req, res, next) => {
  try {
    const userId = req.query.userId
    if (!userId) throw new ApiError(400, '사용자 ID가 필요합니다.')

    const myHobbies = await Hobby.find({ creator: userId }).sort({ createdAt: -1 })
    res.json(myHobbies)
  } catch (err) {
    next(err)
  }
})

router.get('/search', async (req: any, res: any, next) => {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      throw new ApiError(400, '좌표를 제공해야 검색할 수 있어요.')
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new ApiError(400, '좌표 형식이 올바르지 않습니다.')
    }

    const hobbies = await Hobby.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 3000, // 반경 3km 안
        }
      }
    })

    res.json(hobbies)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, '올바르지 않은 취미 ID 형식입니다.')
    }

    const hobby = await Hobby.findById(id)
    if (!hobby) throw new ApiError(404, '해당 취미를 찾을 수 없습니다.')

    res.json(hobby)
  } catch (err) {
    next(err)
  }
})


export default router