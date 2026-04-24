import Consultation from '#models/consultation'
import type { HttpContext } from '@adonisjs/core/http'
import TableFilter from '../helpers/table_filter.js'
import { DateTime } from 'luxon'

export default class ConsultationsController {
  async index({ request, inertia }: HttpContext) {
    const table = new TableFilter(request, {
      defaultSort: 'created_at',
      defaultOrder: 'desc',
      allowedSorts: ['id', 'license_plate', 'partner', 'consulted_by', 'created_at'],
    })
    const type = String(request.input('type') ?? '').trim()
    const consultedBy = String(request.input('consultedBy') ?? '').trim()
    const wasRefueled = String(request.input('wasRefueled') ?? '').trim()
    const startDate = String(request.input('startDate') ?? '').trim()
    const endDate = String(request.input('endDate') ?? '').trim()

    const consultations = await table.paginate(
      Consultation.query()
        .if(table.search, (query) => {
          query
            .whereILike('license_plate', `%${table.search}%`)
            .orWhereILike('partner', `%${table.search}%`)
            .orWhereILike('consulted_by', `%${table.search}%`)
            .orWhereILike('id', `%${table.search}%`)
        })
        .if(type, (query) => {
          query.where('partner', type)
        })
        .if(consultedBy, (query) => {
          query.where('consulted_by', consultedBy)
        })
        .if(wasRefueled === 'true' || wasRefueled === 'false', (query) => {
          query.where('was_refueled', wasRefueled === 'true')
        })
        .if(startDate, (query) => {
          query.where('created_at', '>=', startDate)
        })
        .if(endDate, (query) => {
          query.where('created_at', '<=', DateTime.fromISO(endDate).endOf('day').toSQL()!)
        })
    )

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
        type: type || undefined,
        consultedBy: consultedBy || undefined,
        wasRefueled: wasRefueled || undefined,
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
      },
    })
  }

  async show({ params, inertia }: HttpContext) {
    const consultation = await Consultation.findOrFail(params.id)

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
      vehicleSituation: consultation.vehicleSituation,
      wasRefueled: Boolean(consultation.wasRefueled),
      consultedBy: consultation.consultedBy,
      consultedByLabel: consultation.consultedByLabel,
      fuelPumpVisorImage: consultation.fuelPumpVisorImage,
      createdAt: consultation.formattedCreatedAt,
      updatedAt: consultation.updatedAt?.toFormat('dd/MM/yyyy HH:mm') ?? null,
    }
  }
}
