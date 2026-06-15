import { UserFaceImageSchema } from '#database/schema'
import User from '#models/user'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserFaceImage extends UserFaceImageSchema {
  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'image_path' })
  declare imagePath: string

  @column({ columnName: 'face_descriptor' })
  declare faceDescriptor: string

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
