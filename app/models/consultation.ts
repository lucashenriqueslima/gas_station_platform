import { ConsultationSchema } from '#database/schema'
import GasStation from '#models/gas_station'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export const Partner = {
  solidy: 'solidy',
  motoclub: 'motoclub',
} as const

export const ConsultedBy = {
  license_plate: 'license_plate',
  cpf: 'cpf',
  vouncher: 'vouncher',
} as const

export type Partner = (typeof Partner)[keyof typeof Partner]
export type ConsultedBy = (typeof ConsultedBy)[keyof typeof ConsultedBy]

export default class Consultation extends ConsultationSchema {
  @column({ columnName: 'gas_station_id' })
  declare gasStationId: number | null

  @belongsTo(() => GasStation, {
    foreignKey: 'gasStationId',
  })
  declare gasStation: BelongsTo<typeof GasStation>

  get formattedCreatedAt() {
    return this.createdAt.toFormat('dd/MM/yyyy HH:mm')
  }

  get partnerLabel() {
    return this.partner ? this.partner.charAt(0).toUpperCase() + this.partner.slice(1) : ''
  }

  get consultedByLabel() {
    if (this.consultedBy == ConsultedBy.cpf) return 'CPF'

    return 'Placa'
  }
}
