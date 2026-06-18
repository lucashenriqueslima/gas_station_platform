import { handleIlevaError } from '#helpers/ileva_error_responder'
import { parseBoolean, sanitizePlate } from '#services/ileva/request_helpers'
import { readString, readValue, withPartner } from '#services/ileva/response_helpers'
import { ilevaClient } from '#services/ileva/ileva_client'
import UpstreamApiError from '#services/ileva/upstream_api_error'
import type { HttpContext } from '@adonisjs/core/http'
import type { IlevaPartner } from '#services/ileva/types'

export default class VehiclesController {
  async show({ params, request, response }: HttpContext) {
    const licensePlate = sanitizePlate(params.plate)
    if (!licensePlate) {
      return response.status(422).json({ message: 'A placa informada esta vazia' })
    }

    try {
      const data = await ilevaClient.findVehicleAcrossPartners({
        licensePlate,
        showTransferOwnership: parseBoolean(request.input('mostrar_troca_titularidade')),
      })

      const vehicle = readValue(data, 'veiculo')
      if (this.hasActiveVehicle(vehicle)) {
        return response.ok(data)
      }

      const fallbackData = await this.findActiveLeadVehicleAcrossPartners(licensePlate)
      if (fallbackData) {
        return response.ok(withPartner(fallbackData.data, fallbackData.partner))
      }

      return response.ok(data)
    } catch (error) {
      return handleIlevaError(error, response, 'Falha ao buscar veiculo por placa na API Ileva')
    }
  }

  private hasActiveVehicle(vehicle: unknown) {
    return vehicle && typeof vehicle === 'object' && readString(vehicle, 'situacao') === 'ATIVO'
  }

  private async findActiveLeadVehicleAcrossPartners(licensePlate: string) {
    return this.findActiveLeadVehicle('solidy', licensePlate)
  }

  private async findActiveLeadVehicle(partner: IlevaPartner, licensePlate: string) {
    let leadData: unknown

    try {
      leadData = await ilevaClient.listLeadsByPlate(partner, licensePlate)
    } catch (error) {
      if (error instanceof UpstreamApiError && [400, 404].includes(error.status)) {
        return null
      }

      throw error
    }

    const lead = this.readObjectArray(leadData, 'leads')[0]
    if (!lead) {
      return null
    }

    const termId = this.readPositiveInteger(lead, 'cod_termo')
    if (!termId) {
      throw new UpstreamApiError('O primeiro lead encontrado nao possui cod_termo.', 422, lead)
    }

    let termData: unknown

    try {
      termData = await ilevaClient.getTermById(partner, termId)
    } catch (error) {
      if (error instanceof UpstreamApiError && [400, 404].includes(error.status)) {
        throw new UpstreamApiError('Termo nao encontrado para o cod_termo informado.', 422, {
          cod_termo: termId,
          lead,
        })
      }

      throw error
    }

    const sentAt = this.readNestedString(termData, ['termo', 'dt_hr_envio'])
    if (!sentAt) {
      throw new UpstreamApiError('O termo encontrado nao possui data de envio.', 422, {
        cod_termo: termId,
        lead,
        termo: termData,
      })
    }

    return {
      partner,
      data: {
        veiculo: {
          situacao: 'Ativo',
        },
      },
    }
  }

  private readObjectArray(data: unknown, key: string) {
    const value = readValue(data, key)
    return Array.isArray(value)
      ? value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      : []
  }

  private readPositiveInteger(data: unknown, key: string) {
    const value = readValue(data, key)
    const parsed = Number.parseInt(`${value ?? ''}`, 10)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null
  }

  private readNestedString(data: unknown, keys: string[]) {
    let current = data

    for (const key of keys) {
      current = readValue(current, key)
      if (current === null || current === undefined) {
        return null
      }
    }

    return typeof current === 'string' && current.trim().length > 0 ? current.trim() : null
  }
}
