import { handleIlevaError } from '#helpers/ileva_error_responder'
import { getPartner, sanitizeDigits } from '#services/ileva/request_helpers'
import { ilevaClient } from '#services/ileva/ileva_client'
import type { HttpContext } from '@adonisjs/core/http'

export default class AssociatesController {
  async show({ params, request, response }: HttpContext) {
    const document = sanitizeDigits(params.id)
    if (!document) {
      return response.status(422).json({ message: 'O CPF/CNPJ informado esta vazio' })
    }

    try {
      return response.ok(
        await ilevaClient.findAssociate(getPartner(request.input('partner')), document)
      )
    } catch (error) {
      return handleIlevaError(
        error,
        response,
        'Falha ao buscar associado por CPF/CNPJ na API Ileva'
      )
    }
  }
}
