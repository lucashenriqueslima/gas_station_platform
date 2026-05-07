import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const apiController = controllers.api.v1.gasStationApp
const gasStationsController = () =>
  import('#controllers/api/v_1/gas_station_app/gas_stations_controller')
const plateRecognizerController = () =>
  import('#controllers/api/v_1/gas_station_app/plate_recognizer_controller')
const ilevaVehiclesController = () =>
  import('#controllers/api/v_1/gas_station_app/ileva/vehicles_controller')
const ilevaAssociatesController = () =>
  import('#controllers/api/v_1/gas_station_app/ileva/associates_controller')
const ilevaAssociateChargesController = () =>
  import('#controllers/api/v_1/gas_station_app/ileva/associate_charges_controller')

router
  .group(() => {
    router.get('/gas-station', [gasStationsController, 'get'])
    router.post('/consultations', [apiController.Consultantions, 'store'])
    router.patch('/consultations/:id', [apiController.Consultantions, 'update'])
    router.get('/vouncher/:code/validate', [apiController.Vounchers, 'validate'])
    router.post('/vouncher/:code/utilizations', [apiController.VouncherUtilizations, 'store'])
    router.post('/plate-recognizer', [plateRecognizerController, 'store'])
    router.get('/ileva/vehicle/:licensePlate', [ilevaVehiclesController, 'show'])
    router.get('/ileva/associate/:id', [ilevaAssociatesController, 'show'])
    router.get('/ileva/associate/:id/charges', [ilevaAssociateChargesController, 'index'])
  })
  .prefix('/api/v1/gas-station-app')
