import { AssociateLeadSchema } from '#database/schema'
import User from '#models/user'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class AssociateLead extends AssociateLeadSchema {
  @column({ columnName: 'ileva_associate_id' })
  declare ilevaAssociateId: number | null

  @column({ columnName: 'ileva_lead_id' })
  declare ilevaLeadId: number | null

  @column({ columnName: 'user_id' })
  declare userId: number | null

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  get formattedCreatedAt() {
    return this.createdAt?.toFormat('dd/MM/yyyy HH:mm') ?? '-'
  }
}
