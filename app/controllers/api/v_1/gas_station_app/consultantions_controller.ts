import Consultation from '#models/consultation'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConsultantionsController {
  async store({ request, response }: HttpContext) {
    const { ilevaVehicleId, licensePlate, partner, vehicleSituation } = request.all()

    const consultation = await Consultation.create({
      ilevaVehicleId,
      licensePlate,
      partner,
      vehicleSituation,
    })

    return response.status(201).json(consultation)
  }
}
