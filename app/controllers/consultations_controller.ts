import Consultation from '#models/consultation'
import type { HttpContext } from '@adonisjs/core/http'
import TableFilter from '../helpers/table_filter.js'

export default class ConsultationsController {
  async index({ request, inertia }: HttpContext) {
    const table = new TableFilter(request, {
      defaultSort: 'created_at',
      defaultOrder: 'desc',
      allowedSorts: ['id', 'license_plate', 'partner', 'consulted_by', 'created_at'],
    })

    const consultations = await table.paginate(
      Consultation.query().if(table.search, (query) => {
        query
          .whereILike('license_plate', `%${table.search}%`)
          .orWhereILike('partner', `%${table.search}%`)
          .orWhereILike('consulted_by', `%${table.search}%`)
          .orWhereILike('id', `%${table.search}%`)
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
      filters: table.filters,
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
      wasRefueled: consultation.wasRefueled,
      consultedBy: consultation.consultedBy,
      consultedByLabel: consultation.consultedByLabel,
      fuelPumpVisorImage: consultation.fuelPumpVisorImage,
      createdAt: consultation.formattedCreatedAt,
      updatedAt: consultation.updatedAt?.toFormat('dd/MM/yyyy HH:mm') ?? null,
    }
  }
}
