import AssociateLead from '#models/associate_lead'
import GasStation from '#models/gas_station'
import User from '#models/user'
import AssociateLeadPolicy from '#policies/associate_lead_policy'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import TableFilter from '../helpers/table_filter.js'

export default class AssociateLeadsController {
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with(AssociateLeadPolicy).authorize('viewList')

    const table = new TableFilter(request, {
      defaultSort: 'created_at',
      defaultOrder: 'desc',
      allowedSorts: ['id', 'name', 'phone', 'ileva_associate_id', 'ileva_lead_id', 'created_at'],
    })
    const userIds = this.parseCsvFilter(request.input('userId'))
    const gasStationIds = this.parseCsvFilter(request.input('gasStationId'))
    const ilevaLeadStatus = this.parseCsvFilter(request.input('ilevaLeadStatus'))
    const startDate = String(request.input('startDate') ?? '').trim()
    const endDate = String(request.input('endDate') ?? '').trim()

    const associateLeads = await table.paginate(
      AssociateLead.query()
        .preload('user', (query) => query.preload('gasStation'))
        .if(table.search, (query) => {
          query.where((searchQuery) => {
            searchQuery
              .whereILike('name', `%${table.search}%`)
              .orWhereILike('phone', `%${table.search}%`)

            const numericSearch = Number(table.search)
            if (Number.isInteger(numericSearch)) {
              searchQuery
                .orWhere('id', numericSearch)
                .orWhere('ileva_associate_id', numericSearch)
                .orWhere('ileva_lead_id', numericSearch)
            }
          })
        })
        .if(userIds.length > 0, (query) => {
          query.whereIn('user_id', userIds)
        })
        .if(gasStationIds.length > 0, (query) => {
          query.whereHas('user', (userQuery) => userQuery.whereIn('gas_station_id', gasStationIds))
        })
        .if(
          ilevaLeadStatus.includes('linked') && !ilevaLeadStatus.includes('unlinked'),
          (query) => {
            query.whereNotNull('ileva_lead_id')
          }
        )
        .if(
          ilevaLeadStatus.includes('unlinked') && !ilevaLeadStatus.includes('linked'),
          (query) => {
            query.whereNull('ileva_lead_id')
          }
        )
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

    return inertia.render('associate_leads/index', {
      data: associateLeads.all().map((associateLead) => this.serializeAssociateLead(associateLead)),
      meta: {
        total: associateLeads.getMeta().total,
        perPage: associateLeads.getMeta().perPage,
        currentPage: associateLeads.getMeta().currentPage,
        lastPage: associateLeads.getMeta().lastPage,
      },
      filters: {
        ...table.filters,
        userId: userIds.join(',') || undefined,
        gasStationId: gasStationIds.join(',') || undefined,
        ilevaLeadStatus: ilevaLeadStatus.join(',') || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
      filterOptions: {
        users: users.map((user) => ({
          value: String(user.id),
          label: user.fullName ?? user.email,
        })),
        gasStations: gasStations.map((gasStation) => ({
          value: String(gasStation.id),
          label: gasStation.name,
        })),
        ilevaLeadStatuses: [
          { value: 'linked', label: 'Com lead Ileva' },
          { value: 'unlinked', label: 'Sem lead Ileva' },
        ],
      },
    })
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    const associateLead = await AssociateLead.query()
      .where('id', params.id)
      .preload('user', (query) => query.preload('gasStation'))
      .firstOrFail()

    await bouncer.with(AssociateLeadPolicy).authorize('view', associateLead)

    return inertia.render('associate_leads/show', {
      associateLead: this.serializeAssociateLead(associateLead),
    })
  }

  private serializeAssociateLead(associateLead: AssociateLead) {
    return {
      id: associateLead.id,
      ilevaAssociateId: associateLead.ilevaAssociateId,
      ilevaLeadId: associateLead.ilevaLeadId,
      name: associateLead.name,
      phone: associateLead.phone,
      user: associateLead.user
        ? {
            id: associateLead.user.id,
            name: associateLead.user.fullName ?? associateLead.user.email,
          }
        : null,
      gasStationName: associateLead.user?.gasStation?.name ?? null,
      createdAt: associateLead.formattedCreatedAt,
      updatedAt: associateLead.updatedAt?.toFormat('dd/MM/yyyy HH:mm') ?? null,
    }
  }

  private parseCsvFilter(value: unknown) {
    return String(value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}
