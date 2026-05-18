import vine from '@vinejs/vine'

export const storeVouncher = vine.create({
  type: vine.enum(['operational', 'commercial'] as const),
  partner: vine.enum(['solidy', 'motoclub'] as const),
  maxUtilizations: vine.string().trim().minLength(1),
  ethanolPrice: vine.string().trim().minLength(1),
  gasolinePrice: vine.string().trim().minLength(1),
  dieselPrice: vine.string().trim().minLength(1),
  expiresAt: vine.string().trim().minLength(1),
  isActive: vine.enum(['true', 'false'] as const),
})
