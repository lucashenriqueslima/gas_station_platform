export type IlevaPartner = 'solidy' | 'motoclub'

export type IlevaQueryValue = string | number | boolean

export type IlevaToken = {
  accessToken: string
  expiresAt: number
}

export type IlevaPartnerResult = {
  partner: IlevaPartner
  data: unknown
}

export type IlevaVehicleSearchParams = {
  licensePlate: string
  showTransferOwnership: boolean
}

export type IlevaChargeListParams = {
  associateId: number
  start: number
  perPage: number
}

export type IlevaCreateLeadParams = {
  name: string
  phone: string
  originCode: number
  indicatorAssociateId: number
}
