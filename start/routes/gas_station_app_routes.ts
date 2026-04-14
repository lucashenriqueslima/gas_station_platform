import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const apiController = controllers.api.v1.gasStationApp

router
  .group(() => {
    router.post('/consultations', [apiController.Consultantions, 'store'])
  })
  .prefix('/api/v1/gas-station-app')
