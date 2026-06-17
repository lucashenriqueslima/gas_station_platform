export type EvolutionCheckWhatsAppNumbersParams = {
  numbers: string[]
}

export type EvolutionWhatsAppNumberStatus = {
  number: string
  exists: boolean
}

export type EvolutionCheckWhatsAppNumbersResponse = {
  numbers: EvolutionWhatsAppNumberStatus[]
  rawData: unknown
}
