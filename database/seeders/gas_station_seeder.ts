import { BaseSeeder } from '@adonisjs/lucid/seeders'
import GasStation from '#models/gas_station'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await GasStation.updateOrCreateMany('name', [
      { name: 'Posto Buriti' },
      { name: 'Posto Padre Wendel' },
    ])

    const buritiGasStation = await GasStation.query()
      .where('name', 'Posto Buriti')
      .firstOrFail()

    await db
      .query()
      .from('consultations')
      .whereNull('gas_station_id')
      .update({ gas_station_id: buritiGasStation.id })
  }
}
