import mongoose from 'mongoose'

const HobbySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tag: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
    description: { type: String, required: true },
    locationType: { type: String, enum: ['offline', 'home'], required: true },
    location: {
      type: {
        type: String, // 위치 타입
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: { // [lng, lat] 순서로
        type: [Number],
        required: true,
      },
      address: { type: String }
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

HobbySchema.index({ location: '2dsphere' })

export const Hobby = mongoose.model('Hobby', HobbySchema)