import { UserRole } from '#models/user'
import type User from '#models/user'
import type VouncherUtilization from '#models/vouncher_utilization'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class VouncherUtilizationPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (user?.role === UserRole.ADMIN.value) {
      return true
    }
  }

  viewList(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value
  }

  view(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value
  }

  create(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value || user.role === UserRole.ATTENDANT.value
  }

  update(user: User, utilization: VouncherUtilization): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value && utilization.id > 0
  }

  delete(): AuthorizerResponse {
    return false
  }
}
