/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  accessTokens: {
    store: typeof routes['access_tokens.store']
  }
  gasStations: {
    get: typeof routes['gas_stations.get']
  }
  associateLeads: {
    store: typeof routes['associate_leads.store']
    index: typeof routes['associate_leads.index']
    show: typeof routes['associate_leads.show']
  }
  fuelSuplyCancellations: {
    store: typeof routes['fuel_suply_cancellations.store']
    index: typeof routes['fuel_suply_cancellations.index']
    show: typeof routes['fuel_suply_cancellations.show']
  }
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
  plateRecognizer: {
    store: typeof routes['plate_recognizer.store']
  }
  vehicles: {
    show: typeof routes['vehicles.show']
  }
  ileva: {
    associate: {
      show: typeof routes['ileva.associate.show']
      charges: {
        index: typeof routes['ileva.associate.charges.index']
      }
    }
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
    show: typeof routes['users.show']
    edit: typeof routes['users.edit']
    update: typeof routes['users.update']
  }
  consultations: {
    index: typeof routes['consultations.index']
    show: typeof routes['consultations.show']
  }
}
