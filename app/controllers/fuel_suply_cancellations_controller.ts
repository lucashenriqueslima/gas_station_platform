import FuelSuplyCancellation from '#models/fuel_suply_cancellation'
import GasStation from '#models/gas_station'
import User from '#models/user'
import FuelSuplyCancellationPolicy from '#policies/fuel_suply_cancellation_policy'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import TableFilter from '../helpers/table_filter.js'

export default class FuelSuplyCancellationsController {
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with(FuelSuplyCancellationPolicy).authorize('viewList')

    const table = new TableFilter(request, {
      defaultSort: 'created_at',
      defaultOrder: 'desc',
      allowedSorts: ['id', 'plate', 'created_at'],
    })
    const userIds = this.parseCsvFilter(request.input('userId'))
    const gasStationIds = this.parseCsvFilter(request.input('gasStationId'))
    const startDate = String(request.input('startDate') ?? '').trim()
    const endDate = String(request.input('endDate') ?? '').trim()

    const cancellations = await table.paginate(
      FuelSuplyCancellation.query()
        .preload('user', (query) => query.preload('gasStation'))
        .if(table.search, (query) => {
          query.where((searchQuery) => {
            searchQuery
              .whereILike('plate', `%${table.search}%`)
              .orWhereILike('reason', `%${table.search}%`)

            const numericSearch = Number(table.search)
            if (Number.isInteger(numericSearch)) {
              searchQuery.orWhere('id', numericSearch)
            }
          })
        })
        .if(userIds.length > 0, (query) => {
          query.whereIn('user_id', userIds)
        })
        .if(gasStationIds.length > 0, (query) => {
          query.whereHas('user', (userQuery) => userQuery.whereIn('gas_station_id', gasStationIds))
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

    return inertia.render('fuel_suply_cancellations/index', {
      data: cancellations.all().map((cancellation) => this.serializeCancellation(cancellation)),
      meta: {
        total: cancellations.getMeta().total,
        perPage: cancellations.getMeta().perPage,
        currentPage: cancellations.getMeta().currentPage,
        lastPage: cancellations.getMeta().lastPage,
      },
      filters: {
        ...table.filters,
        userId: userIds.join(',') || undefined,
        gasStationId: gasStationIds.join(',') || undefined,
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
      },
    })
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    const cancellation = await FuelSuplyCancellation.query()
      .where('id', params.id)
      .preload('user', (query) => query.preload('gasStation'))
      .firstOrFail()

    await bouncer.with(FuelSuplyCancellationPolicy).authorize('view', cancellation)

    return inertia.render('fuel_suply_cancellations/show', {
      cancellation: this.serializeCancellation(cancellation),
    })
  }

  private serializeCancellation(cancellation: FuelSuplyCancellation) {
    return {
      id: cancellation.id,
      plate: cancellation.plate,
      reason: cancellation.reason,
      user: cancellation.user
        ? {
            id: cancellation.user.id,
            name: cancellation.user.fullName ?? cancellation.user.email,
          }
        : null,
      gasStationName: cancellation.user?.gasStation?.name ?? null,
      createdAt: cancellation.formattedCreatedAt,
      updatedAt: cancellation.updatedAt?.toFormat('dd/MM/yyyy HH:mm') ?? null,
    }
  }

  private parseCsvFilter(value: unknown) {
    return String(value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}
