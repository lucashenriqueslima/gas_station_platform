import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'consultantions.store': { paramsTuple?: []; params?: {} }
    'consultantions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.validate': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'vouncher_utilizations.store': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'client.vouncher.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'consultations.index': { paramsTuple?: []; params?: {} }
    'consultations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.index': { paramsTuple?: []; params?: {} }
    'vounchers.create': { paramsTuple?: []; params?: {} }
    'vounchers.store': { paramsTuple?: []; params?: {} }
    'vounchers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'consultantions.store': { paramsTuple?: []; params?: {} }
    'vouncher_utilizations.store': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'vounchers.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'consultantions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'vounchers.validate': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'client.vouncher.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'consultations.index': { paramsTuple?: []; params?: {} }
    'consultations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.index': { paramsTuple?: []; params?: {} }
    'vounchers.create': { paramsTuple?: []; params?: {} }
    'vounchers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'vounchers.validate': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'client.vouncher.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'consultations.index': { paramsTuple?: []; params?: {} }
    'consultations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.index': { paramsTuple?: []; params?: {} }
    'vounchers.create': { paramsTuple?: []; params?: {} }
    'vounchers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}