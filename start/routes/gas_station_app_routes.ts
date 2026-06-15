import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const gasStationsController = controllers.api.v1.gasStationApp

router
  .group(() => {
    router.post('/access-tokens', [gasStationsController.AccessTokens, 'store'])
    router.get('/gas-station', [gasStationsController.GasStations, 'get'])
    router.post('/consultations', [gasStationsController.Consultantions, 'store'])
    router.patch('/consultations/:id', [gasStationsController.Consultantions, 'update'])
    router.get('/vouncher/:code/validate', [gasStationsController.Vounchers, 'validate'])
    router.post('/vouncher/:code/utilizations', [
      gasStationsController.VouncherUtilizations,
      'store',
    ])
    router.post('/plate-recognizer', [gasStationsController.PlateRecognizer, 'store'])
    router.get('/ileva/vehicle/:licensePlate', [gasStationsController.ileva.Associates, 'show'])
    router
      .get('/ileva/associate/:id', [gasStationsController.ileva.Associates, 'show'])
      .as('ileva.associate.show')
    router
      .get('/ileva/associate/:id/charges', [gasStationsController.ileva.AssociateCharges, 'index'])
      .as('ileva.associate.charges.index')
  })
  .prefix('/api/v1/gas-station-app')
