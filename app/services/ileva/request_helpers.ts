import type { IlevaPartner } from './types.js'

export function getPartner(value: unknown): IlevaPartner {
  return `${value}`.toLowerCase() === 'motoclub' ? 'motoclub' : 'solidy'
}

export function parseBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value
  }

  return `${value}`.toLowerCase() === 'true'
}

export function sanitizePlate(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function sanitizeDigits(value: string) {
  return value.replace(/[^0-9]/g, '')
}

export function parsePositiveInteger(value: unknown) {
  const integer = Number.parseInt(`${value}`, 10)
  return Number.isInteger(integer) && integer > 0 ? integer : null
}

export function parsePagination(input: {
  start?: unknown
  perPage?: unknown
  defaultStart?: number
  defaultPerPage?: number
}) {
  const start = Number.parseInt(`${input.start ?? input.defaultStart ?? 0}`, 10)
  const perPage = Number.parseInt(`${input.perPage ?? input.defaultPerPage ?? 100}`, 10)

  if (start < 0 || perPage <= 0 || perPage > 500) {
    return null
  }

  return { start, perPage }
}
