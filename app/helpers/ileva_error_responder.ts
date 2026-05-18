import UpstreamApiError from '#services/ileva/upstream_api_error'
import type { HttpContext } from '@adonisjs/core/http'

export function handleIlevaError(
  error: unknown,
  response: HttpContext['response'],
  fallbackMessage: string
) {
  if (error instanceof UpstreamApiError) {
    return response.status(error.status).json({
      message: error.message || fallbackMessage,
      data: error.data,
    })
  }

  return response.status(502).json({
    message: fallbackMessage,
  })
}
