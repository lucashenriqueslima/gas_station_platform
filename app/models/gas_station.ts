import { GasStationSchema } from '#database/schema'
import Consultation from '#models/consultation'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class GasStation extends GasStationSchema {
  @hasMany(() => Consultation, {
    foreignKey: 'gasStationId',
  })
  declare consultations: HasMany<typeof Consultation>
}
