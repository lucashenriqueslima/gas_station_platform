import env from '#start/env'
import app from '@adonisjs/core/services/app'

export type FaceRecognitionConfig = {
  modelsPath: string
  minConfidence: number
  matchThreshold: number
  maxImagesPerUser: number
}

const faceRecognitionConfig: FaceRecognitionConfig = {
  modelsPath: env.get('FACE_RECOGNITION_MODELS_PATH', app.publicPath('models')),
  minConfidence: env.get('FACE_RECOGNITION_MIN_CONFIDENCE', 0.5),
  matchThreshold: env.get('FACE_RECOGNITION_MATCH_THRESHOLD', 0.6),
  maxImagesPerUser: env.get('FACE_RECOGNITION_MAX_IMAGES_PER_USER', 3),
}

export default faceRecognitionConfig
