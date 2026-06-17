/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import AssociateLead from '#models/associate_lead'
import Consultation from '#models/consultation'
import GasStation from '#models/gas_station'
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { DateTime } from 'luxon'
import './routes/gas_station_app_routes.js'

const AssociateLeadsController = () => import('#controllers/associate_leads_controller')
const FuelSuplyCancellationsController = () =>
  import('#controllers/fuel_suply_cancellations_controller')

router
  .get('/', async ({ auth, request, response, inertia }) => {
    if (await auth.check()) {
      const today = DateTime.now().setZone('America/Sao_Paulo')
      const defaultStartDate = today.startOf('month').toISODate() ?? today.toFormat('yyyy-MM-dd')
      const defaultEndDate = today.toISODate() ?? today.toFormat('yyyy-MM-dd')
      const requestedStartDate = String(request.input('startDate') ?? defaultStartDate)
      const requestedEndDate = String(request.input('endDate') ?? defaultEndDate)
      const startDate = DateTime.fromISO(requestedStartDate).isValid
        ? requestedStartDate
        : defaultStartDate
      const endDate = DateTime.fromISO(requestedEndDate).isValid ? requestedEndDate : defaultEndDate
      const endDateTime = DateTime.fromISO(endDate).endOf('day').toSQL()!
      const gasStationId = Number(request.input('gasStationId')) || undefined
      const userId = Number(request.input('userId')) || undefined

      const [consultations, associateLeads, gasStations, users] = await Promise.all([
        Consultation.query()
          .select(['id', 'created_at', 'gas_station_id', 'user_id'])
          .preload('gasStation')
          .preload('user')
          .where('created_at', '>=', startDate)
          .where('created_at', '<=', endDateTime)
          .if(gasStationId, (query) => query.where('gas_station_id', gasStationId!))
          .if(userId, (query) => query.where('user_id', userId!)),
        AssociateLead.query()
          .select(['id', 'created_at', 'user_id'])
          .preload('user', (userQuery) => userQuery.preload('gasStation'))
          .where('created_at', '>=', startDate)
          .where('created_at', '<=', endDateTime)
          .if(userId, (query) => query.where('user_id', userId!))
          .if(gasStationId, (query) => {
            query.whereHas('user', (userQuery) => userQuery.where('gas_station_id', gasStationId!))
          }),
        GasStation.query().select(['id', 'name']).orderBy('name', 'asc'),
        User.query()
          .select(['id', 'full_name', 'email', 'gas_station_id'])
          .orderBy('full_name', 'asc'),
      ])

      return inertia.render('home', {
        filters: {
          startDate,
          endDate,
          gasStationId: gasStationId ? String(gasStationId) : undefined,
          userId: userId ? String(userId) : undefined,
        },
        filterOptions: {
          gasStations: gasStations.map((gasStation) => ({
            value: String(gasStation.id),
            label: gasStation.name,
          })),
          users: users.map((user) => ({
            value: String(user.id),
            label: user.fullName ?? user.email,
            gasStationId: user.gasStationId ? String(user.gasStationId) : undefined,
          })),
        },
        totals: {
          consultations: consultations.length,
          associateLeads: associateLeads.length,
        },
        records: {
          consultations: consultations.map((consultation) => ({
            id: consultation.id,
            createdAt: consultation.createdAt.toISODate(),
            gasStationId: consultation.gasStationId ? String(consultation.gasStationId) : null,
            gasStationName: consultation.gasStation?.name ?? 'Sem posto',
            userId: consultation.userId ? String(consultation.userId) : null,
            userName: consultation.user
              ? (consultation.user.fullName ?? consultation.user.email)
              : 'Sem usuário',
          })),
          associateLeads: associateLeads.map((associateLead) => ({
            id: associateLead.id,
            createdAt: associateLead.createdAt?.toISODate() ?? null,
            gasStationId: associateLead.user?.gasStationId
              ? String(associateLead.user.gasStationId)
              : null,
            gasStationName: associateLead.user?.gasStation?.name ?? 'Sem posto',
            userId: associateLead.userId ? String(associateLead.userId) : null,
            userName: associateLead.user
              ? (associateLead.user.fullName ?? associateLead.user.email)
              : 'Sem usuário',
          })),
        },
      })
    }

    return response.redirect('/login')
  })
  .as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']).as('new_account.create')
    router.post('signup', [controllers.NewAccount, 'store']).as('new_account.store')

    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

router
  .get('cliente/vouncher/:code', [controllers.Vounchers, 'clientShow'])
  .as('client.vouncher.show')

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
    router
      .resource('usuarios', controllers.Users)
      .as('users')
      .only(['index', 'show', 'create', 'store', 'edit', 'update'])
    router
      .resource('consultas', controllers.Consultations)
      .as('consultations')
      .only(['index', 'show'])
    router
      .resource('leads-associados', AssociateLeadsController)
      .as('associate_leads')
      .only(['index', 'show'])
    router
      .resource('cancelamentos-abastecimento', FuelSuplyCancellationsController)
      .as('fuel_suply_cancellations')
      .only(['index', 'show'])
    router
      .resource('vounchers', controllers.Vounchers)
      .as('vounchers')
      .only(['index', 'create', 'store', 'show'])
  })
  .use(middleware.auth())
