import { randomUUID } from 'node:crypto'
import Consultation, { ConsultedBy } from '#models/consultation'
import Vouncher from '#models/vouncher'
import VouncherUtilization from '#models/vouncher_utilization'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class VouncherUtilizationsController {
  async store({ params, request, response }: HttpContext) {
    const payload = request.all()
    const licensePlate = payload.licensePlate ?? payload.plate ?? payload.placa
    const cpf = payload.cpf
    const name = payload.name ?? payload.nome
    const phone = payload.phone ?? payload.telefone

    const fuelPumpVisorImage = request.file('fuelPumpVisorImage', {
      size: '50mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
    })

    if (!licensePlate || !cpf || !name || !phone) {
      return response.status(422).json({
        message: 'Placa, CPF, nome e telefone sao obrigatorios',
      })
    }

    if (!fuelPumpVisorImage) {
      return response.status(422).json({
        message: 'A imagem do visor da bomba e obrigatoria',
      })
    }

    if (!fuelPumpVisorImage.isValid) {
      return response.status(422).json({
        message: 'Arquivo de imagem invalido',
        errors: fuelPumpVisorImage.errors,
      })
    }

    if (!fuelPumpVisorImage.tmpPath) {
      return response.status(422).json({
        message: 'Nao foi possivel processar a imagem enviada',
      })
    }

    const fileExtension = fuelPumpVisorImage.extname ?? 'jpg'
    const fileKey = `consultations/${randomUUID()}.${fileExtension}`
    const contentType =
      fuelPumpVisorImage.type && fuelPumpVisorImage.subtype
        ? `${fuelPumpVisorImage.type}/${fuelPumpVisorImage.subtype}`
        : undefined

    await drive.use().moveFromFs(fuelPumpVisorImage.tmpPath, fileKey, {
      contentType,
    })

    const imageUrl = await drive.use().getUrl(fileKey)
    const trx = await db.transaction()

    try {
      const vouncher = await Vouncher.query()
        .useTransaction(trx)
        .where('code', params.code)
        .forUpdate()
        .firstOrFail()

      if (!vouncher.isValid) {
        await trx.rollback()

        return response.status(422).json({
          message: 'Vouncher invalido ou expirado',
        })
      }

      const utilization = await VouncherUtilization.create(
        {
          vouncherId: vouncher.id,
          licensePlate,
          cpf,
          name,
          phone,
        },
        { client: trx }
      )

      vouncher.currentUtilizations += 1
      vouncher.useTransaction(trx)
      await vouncher.save()

      const consultation = await Consultation.create(
        {
          ilevaVehicleId: null,
          licensePlate,
          partner: vouncher.partner,
          vehicleSituation: 'Voucher utilizado',
          consultedBy: ConsultedBy.vouncher,
          wasRefueled: true,
          fuelPumpVisorImage: imageUrl,
        },
        { client: trx }
      )

      await trx.commit()

      return response.status(201).json({
        utilization,
        consultation,
        vouncher,
      })
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
