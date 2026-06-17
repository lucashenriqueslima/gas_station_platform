import ezchatConfig from '#config/ezchat'
import type { EzChatIndicationPayload, EzChatPayload, EzChatRunParams } from './types.js'

const INDICATION_RUN_ID = 'a207d182-c7a6-4399-a049-d58df21a832c'
const INDICATION_SENDER = 'disparo_indicacao'

class EzChatClient {
  async run<TPayload extends EzChatPayload = EzChatPayload>(params: EzChatRunParams<TPayload>) {
    const url = this.buildRunUrl(params.runId, params.sender)

    return this.fetchJson(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.payload),
    })
  }

  async sendMessage(payload: EzChatIndicationPayload) {
    return this.sendIndication(INDICATION_RUN_ID, payload)
  }

  async sendIndication(runId: string, payload: EzChatIndicationPayload) {
    return this.run({
      runId,
      sender: INDICATION_SENDER,
      payload,
    })
  }

  private buildRunUrl(runId: string, sender: string) {
    const url = new URL(`/run/${runId}/`, ezchatConfig.baseUrl)
    url.searchParams.set('sender', sender)
    url.searchParams.set('token', secret(ezchatConfig.apiToken))

    return url
  }

  private async fetchJson(url: URL, init: RequestInit): Promise<unknown> {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init.headers,
      },
      signal: AbortSignal.timeout(15000),
    })

    const data = await parseJsonResponse(response)
    if (!response.ok) {
      throw new EzChatApiError(extractMessage(data), response.status, data)
    }

    return data
  }
}

export class EzChatApiError extends Error {
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

  return 'Falha ao consultar a API EZChat'
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

export const ezchatClient = new EzChatClient()
