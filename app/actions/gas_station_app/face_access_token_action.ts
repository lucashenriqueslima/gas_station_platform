import faceRecognitionConfig from '#config/face_recognition'
import User from '#models/user'
import type UserFaceImage from '#models/user_face_image'
import type FaceRecognitionService from '#services/face_recognition_service'
import type { FaceDescriptor, FaceMatchCandidate } from '#services/face_recognition_service'

type FaceCandidateData = {
  user: User
  faceImage: UserFaceImage
}

type FaceAccessTokenMatch = {
  user: User
  distance: number
  confidence: number
}

export default class FaceAccessTokenAction {
  async findAttendantByFace(
    faceRecognition: FaceRecognitionService,
    imagePath: string
  ): Promise<FaceAccessTokenMatch | null> {
    const inputDescriptor = await faceRecognition.getDescriptorFromPath(imagePath)
    const candidates = await this.getAttendantCandidates()
    const bestMatch = faceRecognition.findBestMatch(
      inputDescriptor,
      candidates,
      faceRecognitionConfig.matchThreshold
    )

    if (!bestMatch?.matched) {
      return null
    }

    return {
      user: bestMatch.data.user,
      distance: bestMatch.distance,
      confidence: bestMatch.confidence,
    }
  }

  private async getAttendantCandidates(): Promise<FaceMatchCandidate<FaceCandidateData>[]> {
    const users = await User.query()
      // .where('role', UserRole.ATTENDANT.value)
      .preload('gasStation')
      .preload('faceImages')
    const candidates: FaceMatchCandidate<FaceCandidateData>[] = []

    for (const user of users) {
      for (const faceImage of user.faceImages) {
        const descriptor = this.parseDescriptor(faceImage.faceDescriptor)
        if (!descriptor) {
          continue
        }

        candidates.push({
          data: { user, faceImage },
          descriptor,
        })
      }
    }

    return candidates
  }

  private parseDescriptor(value: string): FaceDescriptor | null {
    try {
      const parsed: unknown = JSON.parse(value)
      if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'number')) {
        return null
      }

      return parsed
    } catch {
      return null
    }
  }
}
