import express from 'express'
import { Hobby } from '../models/Hobby'

const router = express.Router()

// GET all
router.get('/', async (req, res) => {
  const hobbies = await Hobby.find()
  res.json(hobbies)
})

// POST create
router.post('/', async (req, res) => {
  const hobby = new Hobby(req.body)
  const saved = await hobby.save()
  res.status(201).json(saved)
})

// GET by ID
router.get('/:id', async (req: any, res: any) => {
  const hobby = await Hobby.findById(req.params.id)
  if (!hobby) return res.status(404).json({ error: 'Not Found' })
  res.json(hobby)
})

export default router