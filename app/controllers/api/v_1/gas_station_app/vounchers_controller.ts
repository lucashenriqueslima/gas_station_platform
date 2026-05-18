import Vouncher from '#models/vouncher'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class VounchersController {
  async validate({ params, response }: HttpContext) {
    const vouncher = await Vouncher.query().where('code', params.code).firstOrFail()

    const isExpired = vouncher.expiresAt < DateTime.local()
    const hasAvailableUtilization = vouncher.currentUtilizations < vouncher.maxUtilizations
    const isValid = vouncher.isActive && !isExpired && hasAvailableUtilization

    return response.ok({
      code: vouncher.code,
      partner: vouncher.partner,
      type: vouncher.type,
      currentUtilizations: vouncher.currentUtilizations,
      maxUtilizations: vouncher.maxUtilizations,
      isActive: vouncher.isActive,
      expiresAt: vouncher.expiresAt.toISO(),
      isExpired,
      hasAvailableUtilization,
      isValid,
    })
  }
}
