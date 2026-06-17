import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GasStationAppAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await ctx.auth.use('api').authenticate()

    user.currentAccessToken.authorize('gas-station-app')

    return next()
  }
}
