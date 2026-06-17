import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const gasStationsController = controllers.api.v1.gasStationApp

router
  .group(() => {
    router.post('/access-tokens', [gasStationsController.AccessTokens, 'store'])

    router
      .group(() => {
        router.get('/gas-station', [gasStationsController.GasStations, 'get'])
        router.post('/associate-leads', [gasStationsController.AssociateLeads, 'store'])
        router.post('/fuel-suply-cancellations', [
          gasStationsController.FuelSuplyCancellations,
          'store',
        ])
        router.post('/consultations', [gasStationsController.Consultantions, 'store'])
        router.patch('/consultations/:id', [gasStationsController.Consultantions, 'update'])
        router.get('/vouncher/:code/validate', [gasStationsController.Vounchers, 'validate'])
        router.post('/vouncher/:code/utilizations', [
          gasStationsController.VouncherUtilizations,
          'store',
        ])
        router.post('/plate-recognizer', [gasStationsController.PlateRecognizer, 'store'])
        router.get('/ileva/vehicle/:licensePlate', [gasStationsController.ileva.Vehicles, 'show'])
        router
          .get('/ileva/associate/:id', [gasStationsController.ileva.Associates, 'show'])
          .as('ileva.associate.show')
        router
          .get('/ileva/associate/:id/charges', [
            gasStationsController.ileva.AssociateCharges,
            'index',
          ])
          .as('ileva.associate.charges.index')
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/v1/gas-station-app')
