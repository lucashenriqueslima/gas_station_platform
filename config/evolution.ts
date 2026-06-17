import env from '#start/env'

const evolutionConfig = {
  baseUrl: env.get('EVOLUTION_BASE_URL'),
  apiKey: env.get('EVOLUTION_API_KEY'),
}

export default evolutionConfig
