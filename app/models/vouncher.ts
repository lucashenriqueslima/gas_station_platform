import VouncherUtilization from '#models/vouncher_utilization'
import { VouncherSchema } from '#database/schema'
import User from '#models/user'
import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export const VouncherTypeEnum = {
  OPERATIONAL: 'operational',
  COMMERCIAL: 'commercial',
} as const

export type VouncherType = (typeof VouncherTypeEnum)[keyof typeof VouncherTypeEnum]

export default class Vouncher extends VouncherSchema {
  get isValid(): boolean {
    return (
      this.isActive &&
      this.expiresAt > DateTime.now() &&
      this.currentUtilizations < this.maxUtilizations
    )
  }

  @column({ columnName: 'created_by' })
  declare createdBy: number | null

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => VouncherUtilization, {
    foreignKey: 'vouncherId',
  })
  declare utilizations: HasMany<typeof VouncherUtilization>
}
