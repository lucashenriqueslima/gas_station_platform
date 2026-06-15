import { UserSchema } from '#database/schema'
import GasStation from '#models/gas_station'
import Vouncher from '#models/vouncher'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import UserFaceImage from '#models/user_face_image'

export const UserRole = {
  ATTENDANT: {
    value: 'attendant',
    label: 'Atendente',
  },
  MANAGER: {
    value: 'manager',
    label: 'Gerente',
  },
  ADMIN: {
    value: 'admin',
    label: 'Admin',
  }
} as const

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole]['value']

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  currentAccessToken?: AccessToken
  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column({ columnName: 'gas_station_id' })
  declare gasStationId: number | null

  @column()
  declare role: UserRoleValue

  @hasMany(() => Vouncher, {
    foreignKey: 'createdBy',
  })
  declare vounchers: HasMany<typeof Vouncher>

  @belongsTo(() => GasStation, {
    foreignKey: 'gasStationId',
  })
  declare gasStation: BelongsTo<typeof GasStation>

  @hasMany(() => UserFaceImage, {
    foreignKey: 'userId',
  })
  declare faceImages: HasMany<typeof UserFaceImage>


  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  get formattedCreatedAt() {
    return this.createdAt.toFormat('dd/MM/yyyy HH:mm')
  }
}
