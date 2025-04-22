import mongoose from 'mongoose'

const HobbySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
)

export const Hobby = mongoose.model('Hobby', HobbySchema)