/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import { UserRole } from '#models/user'
import type User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const isAdmin = Bouncer.ability((user: User) => user.role === UserRole.ADMIN.value)

export const isManager = Bouncer.ability((user: User) => user.role === UserRole.MANAGER.value)

export const isAttendant = Bouncer.ability((user: User) => user.role === UserRole.ATTENDANT.value)

export const isManagerOrAdmin = Bouncer.ability(
  (user: User) => user.role === UserRole.ADMIN.value || user.role === UserRole.MANAGER.value
)

export const isStationOperator = Bouncer.ability(
  (user: User) =>
    user.role === UserRole.ADMIN.value ||
    user.role === UserRole.MANAGER.value ||
    user.role === UserRole.ATTENDANT.value
)
