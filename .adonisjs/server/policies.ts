export const policies = {
  ConsultationPolicy: () => import('#policies/consultation_policy'),
  GasStationPolicy: () => import('#policies/gas_station_policy'),
  UserPolicy: () => import('#policies/user_policy'),
  VouncherPolicy: () => import('#policies/vouncher_policy'),
  VouncherUtilizationPolicy: () => import('#policies/vouncher_utilization_policy'),
}

