/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  consultantions: {
    store: typeof routes['consultantions.store']
    update: typeof routes['consultantions.update']
  }
  vounchers: {
    validate: typeof routes['vounchers.validate']
    index: typeof routes['vounchers.index']
    create: typeof routes['vounchers.create']
    store: typeof routes['vounchers.store']
    show: typeof routes['vounchers.show']
  }
  vouncherUtilizations: {
    store: typeof routes['vouncher_utilizations.store']
  }
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
  client: {
    vouncher: {
      show: typeof routes['client.vouncher.show']
    }
  }
  users: {
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
  }
  consultations: {
    index: typeof routes['consultations.index']
    show: typeof routes['consultations.show']
  }
}
