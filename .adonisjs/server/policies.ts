export const policies = {
  AssociateLeadPolicy: () => import('#policies/associate_lead_policy'),
  ConsultationPolicy: () => import('#policies/consultation_policy'),
  FuelSuplyCancellationPolicy: () => import('#policies/fuel_suply_cancellation_policy'),
  GasStationPolicy: () => import('#policies/gas_station_policy'),
  UserPolicy: () => import('#policies/user_policy'),
  VouncherPolicy: () => import('#policies/vouncher_policy'),
  VouncherUtilizationPolicy: () => import('#policies/vouncher_utilization_policy'),
}

