import { UserRole } from '#models/user'
import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)
const role = () =>
  vine.enum(Object.values(UserRole).map((role) => role.value))

export const storeUser = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  role: role(),
  gasStationId: vine.number().nullable().optional(),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const updateUser = vine.create({
  fullName: vine.string().nullable(),
  email: email(),
  role: role(),
  gasStationId: vine.number().nullable().optional(),
  password: password()
    .confirmed({
      confirmationField: 'passwordConfirmation',
    })
    .optional(),
})

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})
