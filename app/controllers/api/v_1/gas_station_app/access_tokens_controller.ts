import FaceAccessTokenAction from '#actions/gas_station_app/face_access_token_action'
import User from '#models/user'
import FaceRecognitionService from '#services/face_recognition_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'

@inject()
export default class AccessTokensController {
  constructor(
    private readonly faceAccessTokenAction: FaceAccessTokenAction,
    private readonly faceRecognition: FaceRecognitionService
  ) {}

  async store({ request, response }: HttpContext) {
    const faceImage = request.file('faceImage', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!faceImage) {
      return response.unprocessableEntity({
        message: 'A foto do rosto e obrigatoria.',
      })
    }

    if (!faceImage.isValid) {
      return response.unprocessableEntity({
        message: 'Arquivo de imagem invalido.',
        errors: faceImage.errors,
      })
    }

    if (!faceImage.tmpPath) {
      return response.unprocessableEntity({
        message: 'Nao foi possivel processar a foto enviada.',
      })
    }

    try {
      const match = await this.faceAccessTokenAction.findAttendantByFace(
        this.faceRecognition,
        faceImage.tmpPath
      )

      if (!match) {
        return response.unauthorized({
          message: 'Rosto nao reconhecido para um atendente cadastrado.',
        })
      }

      const token = await User.accessTokens.create(match.user, ['gas-station-app'], {
        name: 'Gas Station App',
      })
      const primaryFaceImage = match.user.faceImages.at(0)

      return response.created({
        token: token.value!.release(),
        tokenType: 'Bearer',
        user: {
          id: match.user.id,
          fullName: match.user.fullName,
          email: match.user.email,
          role: match.user.role,
          imageUrl: primaryFaceImage ? await drive.use().getUrl(primaryFaceImage.imagePath) : null,
          gasStation: match.user.gasStation
            ? {
                id: match.user.gasStation.id,
                name: match.user.gasStation.name,
              }
            : null,
        },
        match: {
          confidence: match.confidence,
          distance: match.distance,
        },
      })
    } catch (error) {
      return response.unprocessableEntity({
        message: error instanceof Error ? error.message : 'Nao foi possivel reconhecer o rosto.',
      })
    }
  }

  async delete({ response }: HttpContext) {
    return response.noContent()
  }
}
