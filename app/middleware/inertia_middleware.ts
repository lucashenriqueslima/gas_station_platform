import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserTransformer from '#transformers/user_transformer'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import User from '#models/user'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  share(ctx: HttpContext) {
    /**
     * The share method is called everytime an Inertia page is rendered. In
     * certain cases, a page may get rendered before the session middleware
     * or the auth middleware are executed. For example: During a 404 request.
     *
     * In that case, we must always assume that HttpContext is not fully hydrated
     * with all the properties
     */
    const { session, auth } = ctx as Partial<HttpContext>

    const success: string | null = session?.flashMessages.get('success') || null
    const primaryError: string | null = session?.flashMessages.get('error') || null
    const errorsBag = session?.flashMessages.get('errorsBag') ?? {}
    const error: string | undefined = primaryError
      ? primaryError
      : Object.keys(errorsBag)
          .filter((code) => code !== 'E_VALIDATION_ERROR')
          .map((code) => errorsBag[code])[0]

    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      flash: ctx.inertia.always({
        error,
        success,
      }),
      user: ctx.inertia.always(
        auth?.user ? UserTransformer.transform(auth.user as User) : undefined
      ),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)

    const output = await next()
    this.dispose(ctx)

    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
