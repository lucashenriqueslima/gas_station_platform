import type { ApplicationService } from '@adonisjs/core/types'
import FaceRecognitionService from '#services/face_recognition_service'

export default class FaceRecognitionProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(FaceRecognitionService, () => {
      return new FaceRecognitionService()
    })
  }

  async boot() {
    const faceRecognition = await this.app.container.make(FaceRecognitionService)

    await faceRecognition.loadModels()
  }
}