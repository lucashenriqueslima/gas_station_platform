import { UserRole } from '#models/user'
import type GasStation from '#models/gas_station'
import type User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class GasStationPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (user?.role === UserRole.ADMIN.value) {
      return true
    }
  }

  viewList(): AuthorizerResponse {
    return true
  }

  view(user: User, gasStation: GasStation): AuthorizerResponse {
    if (user.role === UserRole.MANAGER.value) {
      return true
    }

    return user.gasStationId !== null && user.gasStationId === gasStation.id
  }

  create(): AuthorizerResponse {
    return false
  }

  update(): AuthorizerResponse {
    return false
  }

  delete(): AuthorizerResponse {
    return false
  }
}
