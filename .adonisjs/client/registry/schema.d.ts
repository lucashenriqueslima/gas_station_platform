/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'consultantions.store': {
    methods: ["POST"]
    pattern: '/api/v1/gas-station-app/consultations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/consultantions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/consultantions_controller').default['store']>>>
    }
  }
  'consultantions.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/gas-station-app/consultations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/consultantions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/consultantions_controller').default['update']>>>
    }
  }
  'vounchers.validate': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/gas-station-app/vouncher/:code/validate'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/vounchers_controller').default['validate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/vounchers_controller').default['validate']>>>
    }
  }
  'vouncher_utilizations.store': {
    methods: ["POST"]
    pattern: '/api/v1/gas-station-app/vouncher/:code/utilizations'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/vouncher_utilizations_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/api/v_1/gas_station_app/vouncher_utilizations_controller').default['store']>>>
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'client.vouncher.show': {
    methods: ["GET","HEAD"]
    pattern: '/cliente/vouncher/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['clientShow']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['clientShow']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'users.index': {
    methods: ["GET","HEAD"]
    pattern: '/usuarios'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
    }
  }
  'users.create': {
    methods: ["GET","HEAD"]
    pattern: '/usuarios/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['create']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/usuarios'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').storeUser)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').storeUser)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'consultations.index': {
    methods: ["GET","HEAD"]
    pattern: '/consultas'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/consultations_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/consultations_controller').default['index']>>>
    }
  }
  'consultations.show': {
    methods: ["GET","HEAD"]
    pattern: '/consultas/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/consultations_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/consultations_controller').default['show']>>>
    }
  }
  'vounchers.index': {
    methods: ["GET","HEAD"]
    pattern: '/vounchers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['index']>>>
    }
  }
  'vounchers.create': {
    methods: ["GET","HEAD"]
    pattern: '/vounchers/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['create']>>>
    }
  }
  'vounchers.store': {
    methods: ["POST"]
    pattern: '/vounchers'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/vouncher').storeVouncher)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/vouncher').storeVouncher)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'vounchers.show': {
    methods: ["GET","HEAD"]
    pattern: '/vounchers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/vounchers_controller').default['show']>>>
    }
  }
}
