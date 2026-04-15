import { randomUUID } from 'node:crypto'
import Consultation from '#models/consultation'
import drive from '@adonisjs/drive/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConsultantionsController {
  async store({ request, response }: HttpContext) {
    const { ilevaVehicleId, licensePlate, partner, vehicleSituation, consultedBy } = request.all()

    const consultation = await Consultation.create({
      ilevaVehicleId,
      licensePlate,
      partner,
      vehicleSituation,
      consultedBy,
      wasRefueled: false,
      fuelPumpVisorImage: null,
    })

    return response.status(201).json(consultation)
  }

  async update({ params, request, response }: HttpContext) {
    const consultation = await Consultation.findOrFail(params.id)

    const image = request.file('image', {
      size: '50mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
    })

    if (!image) {
      return response.status(422).json({
        message: 'A imagem e obrigatoria',
      })
    }

    if (!image.isValid) {
      return response.status(422).json({
        message: 'Arquivo de imagem invalido',
        errors: image.errors,
      })
    }

    if (!image.tmpPath) {
      return response.status(422).json({
        message: 'Nao foi possivel processar a imagem enviada',
      })
    }

    const fileExtension = image.extname ?? 'jpg'
    const fileKey = `consultations/${randomUUID()}.${fileExtension}`
    const contentType = image.type && image.subtype ? `${image.type}/${image.subtype}` : undefined

    await drive.use().moveFromFs(image.tmpPath, fileKey, {
      contentType,
    })

    consultation.merge({
      fuelPumpVisorImage: await drive.use().getUrl(fileKey),
      wasRefueled: true,
    })

    await consultation.save()

    return response.status(200).json(consultation)
  }
}
