import mongoose from 'mongoose'

const HobbySchema = new mongoose.Schema({
  name: { type: String, required: true },
  tag: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
  description: { type: String, required: true },
  locationType: { type: String, enum: ['offline', 'home'], required: true },
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
}, { timestamps: true })

export const Hobby = mongoose.model('Hobby', HobbySchema)