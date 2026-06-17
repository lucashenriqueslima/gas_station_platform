import Consultation from '#models/consultation'
import GasStation from '#models/gas_station'
import User from '#models/user'
import ConsultationPolicy from '#policies/consultation_policy'
import type { HttpContext } from '@adonisjs/core/http'
import TableFilter from '../helpers/table_filter.js'
import { DateTime } from 'luxon'

export default class ConsultationsController {
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with(ConsultationPolicy).authorize('viewList')

    const table = new TableFilter(request, {
      defaultSort: 'created_at',
      defaultOrder: 'desc',
      allowedSorts: ['id', 'license_plate', 'partner', 'consulted_by', 'created_at'],
    })
    const types = this.parseCsvFilter(request.input('type'))
    const consultedBy = this.parseCsvFilter(request.input('consultedBy'))
    const wasRefueled = this.parseCsvFilter(request.input('wasRefueled'))
    const gasStationIds = this.parseCsvFilter(request.input('gasStationId'))
    const userIds = this.parseCsvFilter(request.input('userId'))
    const startDate = String(request.input('startDate') ?? '').trim()
    const endDate = String(request.input('endDate') ?? '').trim()

    const consultations = await table.paginate(
      Consultation.query()
        .preload('gasStation')
        .preload('user')
        .if(table.search, (query) => {
          query.where((searchQuery) => {
            searchQuery
              .whereILike('license_plate', `%${table.search}%`)
              .orWhereILike('partner', `%${table.search}%`)
              .orWhereILike('consulted_by', `%${table.search}%`)

            const numericSearch = Number(table.search)
            if (Number.isInteger(numericSearch)) {
              searchQuery.orWhere('id', numericSearch)
            }
          })
        })
        .if(types.length > 0, (query) => {
          query.whereIn('partner', types)
        })
        .if(consultedBy.length > 0, (query) => {
          query.whereIn('consulted_by', consultedBy)
        })
        .if(wasRefueled.length === 1 && ['true', 'false'].includes(wasRefueled[0]), (query) => {
          query.where('was_refueled', wasRefueled[0] === 'true')
        })
        .if(gasStationIds.length > 0, (query) => {
          query.whereIn('gas_station_id', gasStationIds)
        })
        .if(userIds.length > 0, (query) => {
          query.whereIn('user_id', userIds)
        })
        .if(startDate, (query) => {
          query.where('created_at', '>=', startDate)
        })
        .if(endDate, (query) => {
          query.where('created_at', '<=', DateTime.fromISO(endDate).endOf('day').toSQL()!)
        })
    )

    const [gasStations, users] = await Promise.all([
      GasStation.query().select(['id', 'name']).orderBy('name', 'asc'),
      User.query().select(['id', 'full_name', 'email']).orderBy('full_name', 'asc'),
    ])

    return inertia.render('consultations/index', {
      data: consultations.all().map((consultation) => this.serializeConsultation(consultation)),
      meta: {
        total: consultations.getMeta().total,
        perPage: consultations.getMeta().perPage,
        currentPage: consultations.getMeta().currentPage,
        lastPage: consultations.getMeta().lastPage,
      },
      filters: {
        ...table.filters,
        type: types.join(',') || undefined,
        consultedBy: consultedBy.join(',') || undefined,
        wasRefueled: wasRefueled.join(',') || undefined,
        gasStationId: gasStationIds.join(',') || undefined,
        userId: userIds.join(',') || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
      filterOptions: {
        types: [
          { value: 'solidy', label: 'Solidy' },
          { value: 'motoclub', label: 'Motoclub' },
        ],
        wasRefueledOptions: [
          { value: 'true', label: 'Sim' },
          { value: 'false', label: 'Não' },
        ],
        consultedByOptions: [
          { value: 'license_plate', label: 'Placa' },
          { value: 'cpf', label: 'CPF' },
          { value: 'vouncher', label: 'Voucher' },
        ],
        gasStations: gasStations.map((gasStation) => ({
          value: String(gasStation.id),
          label: gasStation.name,
        })),
        users: users.map((user) => ({
          value: String(user.id),
          label: user.fullName ?? user.email,
        })),
      },
    })
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    const consultation = await Consultation.query()
      .where('id', params.id)
      .preload('gasStation')
      .preload('user')
      .firstOrFail()

    await bouncer.with(ConsultationPolicy).authorize('view', consultation)

    return inertia.render('consultations/show', {
      consultation: this.serializeConsultation(consultation),
    })
  }

  private serializeConsultation(consultation: Consultation) {
    return {
      id: consultation.id,
      ilevaVehicleId: consultation.ilevaVehicleId,
      licensePlate: consultation.licensePlate,
      partner: consultation.partner,
      partnerLabel: consultation.partnerLabel,
      gasStationName: consultation.gasStation?.name ?? null,
      user: consultation.user
        ? {
            id: consultation.user.id,
            name: consultation.user.fullName ?? consultation.user.email,
          }
        : null,
      vehicleSituation: consultation.vehicleSituation,
      wasRefueled: Boolean(consultation.wasRefueled),
      consultedBy: consultation.consultedBy,
      consultedByLabel: consultation.consultedByLabel,
      fuelPumpVisorImage: consultation.fuelPumpVisorImage,
      createdAt: consultation.formattedCreatedAt,
      updatedAt: consultation.updatedAt?.toFormat('dd/MM/yyyy HH:mm') ?? null,
    }
  }

  private parseCsvFilter(value: unknown) {
    return String(value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}
