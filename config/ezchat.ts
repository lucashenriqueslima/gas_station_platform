import env from '#start/env'

const ezchatConfig = {
    baseUrl: env.get('EZCHAT_BASE_URL'),
    apiToken: env.get('EZCHAT_API_TOKEN')
}

export default ezchatConfig