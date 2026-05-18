import GasStation from '#models/gas_station'
import type { HttpContext } from '@adonisjs/core/http'

export default class GasStationsController {
  async get({ response }: HttpContext) {
    const gasStations = await GasStation.query().orderBy('id', 'asc')

    return response.ok(gasStations)
  }
}
