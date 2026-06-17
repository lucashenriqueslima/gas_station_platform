import { handleIlevaError } from '#helpers/ileva_error_responder'
import AssociateLead from '#models/associate_lead'
import { evolutionClient, EvolutionApiError } from '#services/evolution/evolution_client'
import { getPartner, parsePositiveInteger } from '#services/ileva/request_helpers'
import { readValue } from '#services/ileva/response_helpers'
import { ilevaClient } from '#services/ileva/ileva_client'
import type { HttpContext } from '@adonisjs/core/http'
import type { IlevaPartner } from '#services/ileva/types'

export default class AssociateLeadsController {
  async store({ auth, request, response }: HttpContext) {
    const associateId = parsePositiveInteger(request.input('ileva_associate_id'))
    const associateName = this.readRequiredString(request.input('ileva_associate_name'))
    const name = this.readRequiredString(request.input('name'))
    const phone = this.readRequiredString(request.input('phone'))
    const partner = this.readPartner(request.input('partner'))

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

    if (!partner) {
      return response.unprocessableEntity({
        message: 'O campo partner deve ser solidy ou motoclub',
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

    let ezchatResponse: unknown

    // try {
    //   ezchatResponse = await ezchatClient.sendMessage({
    //     indicado: name,
    //     associado: associateName,
    //     numero_phone: phone,
    //   })
    // } catch (error) {
    //   if (error instanceof EzChatApiError) {
    //     return response.status(error.status).json({
    //       message: error.message,
    //       data: error.data,
    //     })
    //   }

    //   return response.status(502).json({
    //     message: 'Falha ao enviar mensagem pela API EZChat',
    //   })
    // }

    let ilevaResponse: unknown

    try {
      ilevaResponse = await ilevaClient.createLead(partner, {
        name,
        phone,
        originCode: 30,
        indicatorAssociateId: associateId,
      })
    } catch (error) {
      return handleIlevaError(error, response, 'Falha ao criar lead na API Ileva')
    }

    const associateLead = await AssociateLead.create({
      ilevaAssociateId: associateId,
      ilevaLeadId: this.readIlevaLeadId(ilevaResponse),
      name,
      phone,
      userId: auth.user!.id
    })

    return response.created({
      associateLead,
      whatsapp: whatsappNumber,
      ezchat: ezchatResponse,
      ileva: ilevaResponse,
    })
  }

  private readRequiredString(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null
  }

  private readPartner(value: unknown): IlevaPartner | null {
    if (!['solidy', 'motoclub'].includes(`${value}`.toLowerCase())) {
      return null
    }

    return getPartner(value)
  }

  private whatsAppNumberExists(data: unknown) {
    return !!data && typeof data === 'object' && readValue(data, 'exists') === true
  }

  private readIlevaLeadId(data: unknown) {
    return (
      this.readPositiveInteger(data, 'cod_lead') ??
      this.readPositiveInteger(data, 'codigo_lead') ??
      this.readPositiveInteger(data, 'id') ??
      this.readPositiveInteger(readValue(data, 'lead'), 'cod_lead') ??
      this.readPositiveInteger(readValue(data, 'lead'), 'id')
    )
  }

  private readPositiveInteger(data: unknown, key: string) {
    const parsed = Number.parseInt(`${readValue(data, key) ?? ''}`, 10)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null
  }
}
