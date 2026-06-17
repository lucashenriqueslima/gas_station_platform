import evolutionConfig from '#config/evolution'
import type {
  EvolutionCheckWhatsAppNumbersParams,
  EvolutionCheckWhatsAppNumbersResponse,
  EvolutionWhatsAppNumberStatus,
} from './types.js'

const INSTANCE_NAME = 'posto_solidy'

class EvolutionClient {
  async checkWhatsAppNumbers(
    params: EvolutionCheckWhatsAppNumbersParams
  ): Promise<EvolutionCheckWhatsAppNumbersResponse> {
    const url = new URL(`/chat/whatsappNumbers/${INSTANCE_NAME}`, evolutionConfig.baseUrl)
    const response = await this.fetchJson(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numbers: params.numbers.map((number) => this.normalizeBrazilianNumber(number)),
      }),
    })

    return {
      numbers: this.readNumbers(response),
      rawData: response,
    }
  }

  async checkWhatsAppNumber(number: string) {
    const response = await this.checkWhatsAppNumbers({ numbers: [number] })
    return (
      response.numbers[0] ?? {
        number: this.normalizeBrazilianNumber(number),
        exists: false,
      }
    )
  }

  private normalizeBrazilianNumber(number: string) {
    const digits = number.replace(/\D/g, '')

    if (digits.length === 10 || digits.length === 11) {
      return `55${digits}`
    }

    return digits
  }

  private readNumbers(data: unknown): EvolutionWhatsAppNumberStatus[] {
    const numbers = Array.isArray(data) ? data : this.readValue(data, 'numbers')
    if (!Array.isArray(numbers)) {
      throw new EvolutionApiError('Resposta invalida ao consultar numero no WhatsApp', 502, data)
    }

    return numbers
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item) => ({
        number: `${this.readValue(item, 'number') ?? ''}`,
        exists: this.readValue(item, 'exists') === true,
      }))
  }

  private async fetchJson(url: URL, init: RequestInit): Promise<unknown> {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init.headers,
        apikey: secret(evolutionConfig.apiKey),
      },
      signal: AbortSignal.timeout(15000),
    })

    const data = await parseJsonResponse(response)
    if (!response.ok) {
      throw new EvolutionApiError(extractMessage(data), response.status, data)
    }

    return data
  }

  private readValue(data: unknown, key: string) {
    if (!data || typeof data !== 'object' || !(key in data)) {
      return null
    }

    return (data as Record<string, unknown>)[key]
  }
}

export class EvolutionApiError extends Error {
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
      readString(data, 'mensagem') ?? readString(data, 'message') ?? readString(data, 'error')

    if (message) {
      return message
    }
  }

  if (typeof data === 'string' && data.trim()) {
    return data.trim()
  }

  return 'Falha ao consultar a API Evolution'
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

export const evolutionClient = new EvolutionClient()
