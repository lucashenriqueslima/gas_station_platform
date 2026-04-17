import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const apiController = controllers.api.v1.gasStationApp

router
  .group(() => {
    router.post('/consultations', [apiController.Consultantions, 'store'])
    router.patch('/consultations/:id', [apiController.Consultantions, 'update'])
    router.get('/vouncher/:code/validate', [apiController.Vounchers, 'validate'])
    router.post('/vouncher/:code/utilizations', [apiController.VouncherUtilizations, 'store'])
  })
  .prefix('/api/v1/gas-station-app')
