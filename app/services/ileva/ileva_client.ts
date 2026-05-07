import env from '#start/env'
import UpstreamApiError from './upstream_api_error.js'
import {
  extractMessage,
  hasVehicle,
  parseJsonResponse,
  readString,
  readValue,
  withPartner,
} from './response_helpers.js'
import type {
  IlevaChargeListParams,
  IlevaPartner,
  IlevaPartnerResult,
  IlevaQueryValue,
  IlevaToken,
  IlevaVehicleSearchParams,
} from './types.js'

const PARTNERS: IlevaPartner[] = ['solidy', 'motoclub']

class IlevaClient {
  private tokenCache = new Map<IlevaPartner, IlevaToken>()

  async findVehicleAcrossPartners(params: IlevaVehicleSearchParams) {
    const results = await Promise.allSettled(
      PARTNERS.map((partner) =>
        this.request(partner, '/veiculo/buscar', {
          placa: params.licensePlate,
          mostrar_troca_titularidade: params.showTransferOwnership,
        })
      )
    )

    const successfulResults = results.filter(
      (result): result is PromiseFulfilledResult<IlevaPartnerResult> =>
        result.status === 'fulfilled'
    )
    const selectedResult = successfulResults.find((result) => hasVehicle(result.value.data))

    if (selectedResult) {
      return withPartner(selectedResult.value.data, selectedResult.value.partner)
    }

    if (successfulResults[0]) {
      return withPartner(successfulResults[0].value.data, successfulResults[0].value.partner)
    }

    const rejectedResult = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    throw rejectedResult?.reason ?? new Error('Falha ao buscar veiculo por placa na API Ileva')
  }

  async findAssociate(partner: IlevaPartner, document: string) {
    const { data } = await this.request(partner, '/associado/buscar', {
      cpf_cnpj: document,
    })

    return data
  }

  async listCharges(partner: IlevaPartner, params: IlevaChargeListParams) {
    const { data } = await this.request(partner, '/cobranca/listar-associado-veiculo', {
      cod_associado: params.associateId,
      inicio_paginacao: params.start,
      quantidade_por_pagina: params.perPage,
    })

    return data
  }

  async listLeadsByPlate(partner: IlevaPartner, licensePlate: string) {
    const today = new Date()
    const createdAtStart = new Date(today)
    createdAtStart.setDate(createdAtStart.getDate() - 5)

    const { data } = await this.request(partner, '/lead/listar', {
      inicio_paginacao: 0,
      quantidade_por_pagina: 100,
      placa: licensePlate,
      dt_criacao_de: this.formatDate(createdAtStart),
    })

    return data
  }

  async getTermById(partner: IlevaPartner, termId: number) {
    const { data } = await this.request(partner, `/termo/${termId}`, {})

    return data
  }

  private async request(
    partner: IlevaPartner,
    path: string,
    query: Record<string, IlevaQueryValue>
  ): Promise<IlevaPartnerResult> {
    const url = this.buildUrl(path, query)

    try {
      return {
        partner,
        data: await this.fetchJson(url, await this.getAccessToken(partner)),
      }
    } catch (error) {
      if (!(error instanceof UpstreamApiError) || error.status !== 401) {
        throw error
      }

      this.tokenCache.delete(partner)
      return {
        partner,
        data: await this.fetchJson(url, await this.getAccessToken(partner, true)),
      }
    }
  }

  private buildUrl(path: string, query: Record<string, IlevaQueryValue>) {
    const url = new URL(path, env.get('ILEVA_BASE_URL'))

    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, `${value}`)
    }

    return url
  }

  private formatDate(value: Date) {
    const year = value.getFullYear()
    const month = `${value.getMonth() + 1}`.padStart(2, '0')
    const day = `${value.getDate()}`.padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  private async fetchJson(url: URL, token: string): Promise<unknown> {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(15000),
    })

    const data = await parseJsonResponse(response)
    if (!response.ok) {
      throw new UpstreamApiError(extractMessage(data), response.status, data)
    }

    return data
  }

  private async getAccessToken(partner: IlevaPartner, forceRefresh = false) {
    const cachedToken = this.tokenCache.get(partner)
    if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now() + 30000) {
      return cachedToken.accessToken
    }

    const response = await fetch(new URL('/oauth/token', env.get('ILEVA_BASE_URL')), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'app_key': this.getAppKey(partner),
      },
      body: JSON.stringify({
        username: secret('ILEVA_USERNAME'),
        password: secret('ILEVA_PASSWORD'),
      }),
      signal: AbortSignal.timeout(15000),
    })

    const data = await parseJsonResponse(response)
    if (!response.ok) {
      throw new UpstreamApiError(extractMessage(data), response.status, data)
    }

    const accessToken = readString(data, 'access_token')
    if (!accessToken) {
      throw new UpstreamApiError('Token de acesso invalido retornado pela API Ileva', 502, data)
    }

    const expiresIn = Number.parseInt(`${readValue(data, 'expires_in') ?? 0}`, 10)
    this.tokenCache.set(partner, {
      accessToken,
      expiresAt: Date.now() + Math.max(expiresIn - 60, 60) * 1000,
    })

    return accessToken
  }

  private getAppKey(partner: IlevaPartner) {
    if (partner === 'motoclub') {
      return secret('ILEVA_MOTOCLUB_APP_KEY')
    }

    return secret('ILEVA_SOLIDY_APP_KEY')
  }
}

function secret(
  key: 'ILEVA_USERNAME' | 'ILEVA_PASSWORD' | 'ILEVA_SOLIDY_APP_KEY' | 'ILEVA_MOTOCLUB_APP_KEY'
) {
  const value = env.get(key) as unknown as string | { release: () => string }
  return typeof value === 'object' ? value.release() : value
}

export const ilevaClient = new IlevaClient()
