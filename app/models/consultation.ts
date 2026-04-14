import { ConsultationSchema } from '#database/schema'
// import { BaseModel, column } from '@adonisjs/lucid/orm'
// import { DateTime } from 'luxon'

export const Partner = {
  solidy: 'solidy',
  motoclub: 'motoclub',
} as const

export const ConsultedBy = {
  license_plate: 'license_plate',
  cpf: 'cpf',
} as const

export type Partner = (typeof Partner)[keyof typeof Partner]
export type ConsultedBy = (typeof ConsultedBy)[keyof typeof ConsultedBy]

export default class Consultation extends ConsultationSchema {
  get formattedCreatedAt() {
    return this.createdAt.toFormat('dd/MM/yyyy HH:mm')
  }

  // @column({ isPrimary: true })
  // declare id: number
  // @column()
  // declare ilevaVehicleId: number
  // @column()
  // declare licensePlate: string
  // @column()
  // declare partner: Partner
  // @column()
  // declare vehicleSituation: string
  // @column.dateTime({ autoCreate: true })
  // declare createdAt: DateTime
  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // declare updatedAt: DateTime | null
}
