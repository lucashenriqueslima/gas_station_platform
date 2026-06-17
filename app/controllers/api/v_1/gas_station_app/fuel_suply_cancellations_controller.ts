import FuelSuplyCancellation from '#models/fuel_suply_cancellation'
import type { HttpContext } from '@adonisjs/core/http'

export default class FuelSuplyCancellationsController {
  async store({ auth, request, response }: HttpContext) {
    const plate = this.readRequiredString(request.input('plate'))
    const reason = this.readRequiredString(request.input('reason'))

    if (!plate) {
      return response.unprocessableEntity({
        message: 'O campo plate e obrigatorio',
      })
    }

    if (!reason || reason.length < 20) {
      return response.unprocessableEntity({
        message: 'O motivo do cancelamento deve ter pelo menos 20 caracteres',
      })
    }

    const cancellation = await FuelSuplyCancellation.create({
      plate,
      reason,
      userId: auth.user!.id,
    })

    return response.created(cancellation)
  }

  private readRequiredString(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null
  }
}
