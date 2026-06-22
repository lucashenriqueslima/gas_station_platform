import solidyConfig from '#config/solidy'
import type { SolidyIngestLeadParams } from './types.js'

class SolidyClient {
  async ingestLead(params: SolidyIngestLeadParams) {
    const payload = this.compactPayload({
      id_frentista: params.attendantId,
      nome_frentista: params.attendantName,
      origem: params.origin,
      id_associado_ileva: params.ilevaAssociateId,
      nome_associado_ileva: params.ilevaAssociateName,
      nome_lead: params.leadName,
      telefone_lead: params.leadPhone,
    })

    return this.fetchJson(new URL(solidyConfig.ingestLeadsUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  private compactPayload(payload: Record<string, string | number | null | undefined>) {
    return Object.fromEntries(
      Object.entries(payload).flatMap(([key, value]) => {
        if (value === null || value === undefined) {
          return []
        }

        const normalized = `${value}`.trim()
        return normalized ? [[key, normalized]] : []
      })
    )
  }

  private async fetchJson(url: URL, init: RequestInit): Promise<unknown> {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init.headers,
        Authorization: `Bearer ${secret(solidyConfig.ingestLeadsApiKey)}`,
      },
      signal: AbortSignal.timeout(15000),
    })

    const data = await parseJsonResponse(response)
    if (!response.ok) {
      throw new SolidyApiError(extractMessage(data), response.status, data)
    }

    return data
  }
}

export class SolidyApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown
  ) {
    super(message)
  }
}

function extractMessage(data: unknown) {
  if (data && typeof data === 'object') {
    const message =
      readString(data, 'message') ?? readString(data, 'error') ?? readString(data, 'status')

    if (message) {
      return message
    }
  }

  if (typeof data === 'string' && data.trim()) {
    return data.trim()
  }

  return 'Falha ao enviar lead para a API Solidy'
}

async function parseJsonResponse(response: Response) {
  const text = await response.text()
  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function readString(data: unknown, key: string): string | null {
  if (!data || typeof data !== 'object' || !(key in data)) {
    return null
  }

  const value = (data as Record<string, unknown>)[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function secret(value: string | { release: () => string }) {
  return typeof value === 'object' ? value.release() : value
}

export const solidyClient = new SolidyClient()
