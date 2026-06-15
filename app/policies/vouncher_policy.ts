import { UserRole } from '#models/user'
import type User from '#models/user'
import type Vouncher from '#models/vouncher'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class VouncherPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (user?.role === UserRole.ADMIN.value) {
      return true
    }
  }

  viewList(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value
  }

  view(user: User, vouncher: Vouncher): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value && vouncher.id > 0
  }

  create(user: User): AuthorizerResponse {
    return user.role === UserRole.ADMIN.value
  }

  update(user: User, vouncher: Vouncher): AuthorizerResponse {
    return user.role === UserRole.ADMIN.value && user.id === vouncher.createdBy
  }

  delete(): AuthorizerResponse {
    return false
  }

  validate(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value || user.role === UserRole.ATTENDANT.value
  }

  use(user: User): AuthorizerResponse {
    return user.role === UserRole.MANAGER.value || user.role === UserRole.ATTENDANT.value
  }
}
