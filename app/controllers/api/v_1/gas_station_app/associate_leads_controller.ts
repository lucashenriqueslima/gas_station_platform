import AssociateLead from '#models/associate_lead'
import { evolutionClient, EvolutionApiError } from '#services/evolution/evolution_client'
import { EzChatApiError, ezchatClient } from '#services/ezchat/ezchat_client'
import { parsePositiveInteger } from '#services/ileva/request_helpers'
import { readValue } from '#services/ileva/response_helpers'
import { solidyClient, SolidyApiError } from '#services/solidy/solidy_client'
import type { HttpContext } from '@adonisjs/core/http'

export default class AssociateLeadsController {
  async store({ auth, request, response }: HttpContext) {
    const associateId = parsePositiveInteger(request.input('ileva_associate_id'))
    const associateName = this.readRequiredString(request.input('ileva_associate_name'))
    const name = this.readRequiredString(request.input('name'))
    const phone = this.readRequiredString(request.input('phone'))

    if (!associateId) {
      return response.unprocessableEntity({
        message: 'O codigo do associado Ileva deve ser maior que zero',
      })
    }

    if (!associateName || !name || !phone) {
      return response.unprocessableEntity({
        message: 'Os campos ileva_associate_name, name e phone sao obrigatorios',
      })
    }

    const existLeadsByPhone = await AssociateLead.query().where('phone', phone).first()

    if (existLeadsByPhone) {
      return response.unprocessableEntity({
        message: 'Já existe um lead cadastrado com este telefone',
      })
    }

    let whatsappNumber: unknown

    try {
      whatsappNumber = await evolutionClient.checkWhatsAppNumber(phone)
    } catch (error) {
      if (error instanceof EvolutionApiError) {
        return response.status(error.status).json({
          message: error.message,
          data: error.data,
        })
      }

      return response.status(502).json({
        message: 'Falha ao verificar numero no WhatsApp pela API Evolution',
      })
    }

    if (!this.whatsAppNumberExists(whatsappNumber)) {
      return response.unprocessableEntity({
        message: 'O telefone informado nao possui WhatsApp',
        data: whatsappNumber,
      })
    }

    const user = auth.user!
    await user.load((loader) => loader.load('gasStation'))

    const [ezchatResult, solidyResult] = await Promise.allSettled([
      ezchatClient.sendMessage({
        indicado: name,
        associado: associateName,
        numero_phone: phone,
      }),
      solidyClient.ingestLead({
        attendantId: user.id,
        attendantName: user.fullName ?? user.email,
        origin: user.gasStation?.name,
        ilevaAssociateId: associateId,
        ilevaAssociateName: associateName,
        leadName: name,
        leadPhone: phone,
      }),
    ])

    if (ezchatResult.status === 'rejected') {
      if (ezchatResult.reason instanceof EzChatApiError) {
        return response.status(ezchatResult.reason.status).json({
          message: ezchatResult.reason.message,
          data: ezchatResult.reason.data,
        })
      }

      return response.status(502).json({
        message: 'Falha ao enviar mensagem pela API EZChat',
      })
    }

    if (solidyResult.status === 'rejected') {
      if (solidyResult.reason instanceof SolidyApiError) {
        return response.status(solidyResult.reason.status).json({
          message: solidyResult.reason.message || 'Falha ao enviar lead para a API Solidy',
          data: solidyResult.reason.data,
        })
      }

      return response.status(502).json({
        message: 'Falha ao enviar lead para a API Solidy',
      })
    }

    const ezchatResponse = ezchatResult.status === 'fulfilled' ? ezchatResult.value : null
    const solidyResponse = solidyResult.status === 'fulfilled' ? solidyResult.value : null

    const associateLead = await AssociateLead.create({
      ilevaAssociateId: associateId,
      name,
      phone,
      userId: auth.user!.id,
    })

    return response.created({
      associateLead,
      whatsapp: whatsappNumber,
      ezchat: ezchatResponse,
      solidy: solidyResponse,
    })
  }

  private readRequiredString(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null
  }

  private whatsAppNumberExists(data: unknown) {
    return !!data && typeof data === 'object' && readValue(data, 'exists') === true
  }
}
