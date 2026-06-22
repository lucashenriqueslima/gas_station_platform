import env from '#start/env'

const solidyConfig = {
  ingestLeadsUrl: env.get('SOLIDY_INGEST_LEADS_URL'),
  ingestLeadsApiKey: env.get('SOLIDY_INGEST_LEADS_API_KEY'),
}

export default solidyConfig
