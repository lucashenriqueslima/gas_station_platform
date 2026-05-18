import type { IlevaPartner } from './types.js'

export function extractMessage(data: unknown) {
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

  return 'Falha ao consultar a API Ileva'
}

export function hasVehicle(data: unknown) {
  const vehicle = readValue(data, 'veiculo')
  return Boolean(vehicle && typeof vehicle === 'object')
}

export function withPartner(data: unknown, partner: IlevaPartner) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return {
      ...(data as Record<string, unknown>),
      partner,
    }
  }

  return { data, partner }
}

export async function parseJsonResponse(response: Response) {
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

export function readValue(data: unknown, key: string) {
  if (!data || typeof data !== 'object' || !(key in data)) {
    return null
  }

  return (data as Record<string, unknown>)[key]
}

export function readString(data: unknown, key: string): string | null {
  const value = readValue(data, key)
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
