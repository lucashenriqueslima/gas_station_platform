import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'gas_stations.get': { paramsTuple?: []; params?: {} }
    'associate_leads.store': { paramsTuple?: []; params?: {} }
    'fuel_suply_cancellations.store': { paramsTuple?: []; params?: {} }
    'consultantions.store': { paramsTuple?: []; params?: {} }
    'consultantions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.validate': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'vouncher_utilizations.store': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'plate_recognizer.store': { paramsTuple?: []; params?: {} }
    'vehicles.show': { paramsTuple: [ParamValue]; params: {'licensePlate': ParamValue} }
    'ileva.associate.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ileva.associate.charges.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'consultations.index': { paramsTuple?: []; params?: {} }
    'consultations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'associate_leads.index': { paramsTuple?: []; params?: {} }
    'associate_leads.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'fuel_suply_cancellations.index': { paramsTuple?: []; params?: {} }
    'fuel_suply_cancellations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.index': { paramsTuple?: []; params?: {} }
    'vounchers.create': { paramsTuple?: []; params?: {} }
    'vounchers.store': { paramsTuple?: []; params?: {} }
    'vounchers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'associate_leads.store': { paramsTuple?: []; params?: {} }
    'fuel_suply_cancellations.store': { paramsTuple?: []; params?: {} }
    'consultantions.store': { paramsTuple?: []; params?: {} }
    'vouncher_utilizations.store': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'plate_recognizer.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'vounchers.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'gas_stations.get': { paramsTuple?: []; params?: {} }
    'vounchers.validate': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'vehicles.show': { paramsTuple: [ParamValue]; params: {'licensePlate': ParamValue} }
    'ileva.associate.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ileva.associate.charges.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'client.vouncher.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'consultations.index': { paramsTuple?: []; params?: {} }
    'consultations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'associate_leads.index': { paramsTuple?: []; params?: {} }
    'associate_leads.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'fuel_suply_cancellations.index': { paramsTuple?: []; params?: {} }
    'fuel_suply_cancellations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.index': { paramsTuple?: []; params?: {} }
    'vounchers.create': { paramsTuple?: []; params?: {} }
    'vounchers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'gas_stations.get': { paramsTuple?: []; params?: {} }
    'vounchers.validate': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'vehicles.show': { paramsTuple: [ParamValue]; params: {'licensePlate': ParamValue} }
    'ileva.associate.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'ileva.associate.charges.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'client.vouncher.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'consultations.index': { paramsTuple?: []; params?: {} }
    'consultations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'associate_leads.index': { paramsTuple?: []; params?: {} }
    'associate_leads.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'fuel_suply_cancellations.index': { paramsTuple?: []; params?: {} }
    'fuel_suply_cancellations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vounchers.index': { paramsTuple?: []; params?: {} }
    'vounchers.create': { paramsTuple?: []; params?: {} }
    'vounchers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'consultantions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}