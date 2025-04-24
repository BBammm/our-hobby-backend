import express from 'express'
import { Hobby } from '../models/Hobby'

const router = express.Router()

// GET all
router.get('/', async (req, res) => {
  const hobbies = await Hobby.find()
  res.json(hobbies)
})

router.post('/', async (req: any, res: any) => {
  const { name, tagId, description, locationType, location } = req.body

  if (!name || !tagId || !description) {
    return res.status(400).json({ error: '필수 값 누락' })
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
})

// GET by ID
router.get('/:id', async (req: any, res: any) => {
  const hobby = await Hobby.findById(req.params.id)
  if (!hobby) return res.status(404).json({ error: 'Not Found' })
  res.json(hobby)
})

export default router