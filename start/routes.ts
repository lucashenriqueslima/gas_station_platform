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
import router from '@adonisjs/core/services/router'
import './routes/gas_station_app_routes.js'

router
  .get('/', async ({ auth, response, inertia }) => {
    if (await auth.check()) {
      return inertia.render('home', {})
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

router.get('cliente/vouncher/:code', [controllers.Vounchers, 'clientShow']).as('client.vouncher.show')

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
    router.resource('usuarios', controllers.Users).as('users').only(['index', 'create', 'store'])
    router
      .resource('consultas', controllers.Consultations)
      .as('consultations')
      .only(['index', 'show'])
    router
      .resource('vounchers', controllers.Vounchers)
      .as('vounchers')
      .only(['index', 'create', 'store', 'show'])
  })
  .use(middleware.auth())
