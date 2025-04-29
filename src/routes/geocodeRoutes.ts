import express from 'express'
import axios from 'axios'

const router = express.Router()

router.get('/', async (req: any, res: any) => {
  const { lat, lng } = req.query

  if (!lat || !lng) {
    return res.status(400).json({ error: '위도/경도가 필요합니다.' })
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

    const response = await axios.get(url)
    console.log(response);
    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '구글 API 요청 실패' })
  }
})

export default router