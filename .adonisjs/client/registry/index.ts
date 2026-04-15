/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'consultantions.store': {
    methods: ["POST"],
    pattern: '/api/v1/gas-station-app/consultations',
    tokens: [{"old":"/api/v1/gas-station-app/consultations","type":0,"val":"api","end":""},{"old":"/api/v1/gas-station-app/consultations","type":0,"val":"v1","end":""},{"old":"/api/v1/gas-station-app/consultations","type":0,"val":"gas-station-app","end":""},{"old":"/api/v1/gas-station-app/consultations","type":0,"val":"consultations","end":""}],
    types: placeholder as Registry['consultantions.store']['types'],
  },
  'consultantions.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/gas-station-app/consultations/:id',
    tokens: [{"old":"/api/v1/gas-station-app/consultations/:id","type":0,"val":"api","end":""},{"old":"/api/v1/gas-station-app/consultations/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/gas-station-app/consultations/:id","type":0,"val":"gas-station-app","end":""},{"old":"/api/v1/gas-station-app/consultations/:id","type":0,"val":"consultations","end":""},{"old":"/api/v1/gas-station-app/consultations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['consultantions.update']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/usuarios',
    tokens: [{"old":"/usuarios","type":0,"val":"usuarios","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.create': {
    methods: ["GET","HEAD"],
    pattern: '/usuarios/create',
    tokens: [{"old":"/usuarios/create","type":0,"val":"usuarios","end":""},{"old":"/usuarios/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['users.create']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/usuarios',
    tokens: [{"old":"/usuarios","type":0,"val":"usuarios","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'consultations.index': {
    methods: ["GET","HEAD"],
    pattern: '/consultas',
    tokens: [{"old":"/consultas","type":0,"val":"consultas","end":""}],
    types: placeholder as Registry['consultations.index']['types'],
  },
  'consultations.show': {
    methods: ["GET","HEAD"],
    pattern: '/consultas/:id',
    tokens: [{"old":"/consultas/:id","type":0,"val":"consultas","end":""},{"old":"/consultas/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['consultations.show']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
