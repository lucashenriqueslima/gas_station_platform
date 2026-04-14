/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  users: {
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
  }
  consultations: {
    index: typeof routes['consultations.index']
  }
}
