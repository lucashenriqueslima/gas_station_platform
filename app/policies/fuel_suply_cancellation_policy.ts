import { UserRole } from '#models/user'
import type FuelSuplyCancellation from '#models/fuel_suply_cancellation'
import type User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class FuelSuplyCancellationPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (user?.role === UserRole.ADMIN.value) {
      return true
    }
  }

  viewList(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value
  }

  view(user: User, cancellation: FuelSuplyCancellation): AuthorizerResponse {
    if (user.role === UserRole.MANAGER.value) {
      return true
    }

    return (
      user.role === UserRole.ATTENDANT.value &&
      user.gasStationId !== null &&
      user.gasStationId === cancellation.user?.gasStationId
    )
  }

  create(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value || user.role === UserRole.ATTENDANT.value
  }

  update(): AuthorizerResponse {
    return false
  }

  delete(): AuthorizerResponse {
    return false
  }
}
