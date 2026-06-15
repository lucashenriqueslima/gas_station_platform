import type User from '#models/user'
import { UserRole } from '#models/user'
import type { UserRoleValue } from '#models/user'
import type GasStation from '#models/gas_station'
import { BaseTransformer } from '@adonisjs/core/transformers'

const userRoleLabelByValue = new Map(Object.values(UserRole).map((role) => [role.value, role.label]))

function getUserRoleLabel(role: UserRoleValue) {
  return userRoleLabelByValue.get(role) ?? 'Desconhecido'
}

type UserCreateViewResource = {
  roles: { value: string; label: string }[]
  gasStations: GasStation[]
  maxFaceImages: number
  permissions: {
    chooseRole: boolean
  }
}

type UserEditViewResource = UserCreateViewResource & {
  user: User
}

export default class UserTransformer extends BaseTransformer<User | UserCreateViewResource | UserEditViewResource> {
  toObject() {
    const user = this.resource as User

    return this.pick(user, [
      'id',
      'fullName',
      'email',
      'role',
      'createdAt',
      'updatedAt',
      'initials',
    ])
  }

  toIndexView() {
    const user = this.resource as User

    return {
      ...this.pick(user, ['id', 'fullName', 'email', 'role', 'formattedCreatedAt']),
      roleLabel: getUserRoleLabel(user.role),
      gasStationName: user.gasStation?.name ?? null,
      faceImagesCount: user.faceImages?.length ?? 0,
    }
  }

  toCreateView() {
    const resource = this.resource as UserCreateViewResource

    return {
      roles: resource.roles,
      gasStations: resource.gasStations.map((gasStation) =>
        this.pick(gasStation, ['id', 'name'])
      ),
      maxFaceImages: resource.maxFaceImages,
      permissions: resource.permissions,
    }
  }

  toEditView() {
    const resource = this.resource as UserEditViewResource

    return {
      user: this.pick(resource.user, ['id', 'fullName', 'email', 'role', 'gasStationId']),
      roles: resource.roles,
      gasStations: resource.gasStations.map((gasStation) =>
        this.pick(gasStation, ['id', 'name'])
      ),
      maxFaceImages: resource.maxFaceImages,
      permissions: resource.permissions,
    }
  }
}
