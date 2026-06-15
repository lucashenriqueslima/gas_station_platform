import { UserRole } from '#models/user'
import type User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
  before(user: User | null): AuthorizerResponse | undefined {
    if (user && (user.role === UserRole.ADMIN.value || user.role === UserRole.MANAGER.value)) {
      return true
    }
  }

  viewList(): AuthorizerResponse {
    return false
  }

  view(user: User, resource: User): AuthorizerResponse {
    return user.id === resource.id
  }

  create(): AuthorizerResponse {
    return false
  }

  chooseRole(user: User): AuthorizerResponse {
    return user.role === UserRole.ADMIN.value
  }

  update(user: User, resource: User): AuthorizerResponse {
    return user.id === resource.id
  }

  delete(): AuthorizerResponse {
    return false
  }
}
