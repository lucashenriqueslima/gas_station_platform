import { handleIlevaError } from '#helpers/ileva_error_responder'
import { getPartner, parsePagination, parsePositiveInteger } from '#services/ileva/request_helpers'
import { ilevaClient } from '#services/ileva/ileva_client'
import type { HttpContext } from '@adonisjs/core/http'

export default class AssociateChargesController {
  async index({ params, request, response }: HttpContext) {
    const associateId = parsePositiveInteger(params.id)
    if (associateId === null) {
      return response.status(422).json({ message: 'O codigo do associado deve ser maior que zero' })
    }

    const pagination = parsePagination({
      start: request.input('inicio_paginacao'),
      perPage: request.input('quantidade_por_pagina'),
    })
    if (pagination === null) {
      return response.status(422).json({
        message: 'A paginacao informada e invalida',
      })
    }

    try {
      return response.ok(
        await ilevaClient.listCharges(getPartner(request.input('partner')), {
          associateId,
          start: pagination.start,
          perPage: pagination.perPage,
        })
      )
    } catch (error) {
      return handleIlevaError(
        error,
        response,
        'Falha ao listar cobrancas por associado/veiculo na API Ileva'
      )
    }
  }
}
