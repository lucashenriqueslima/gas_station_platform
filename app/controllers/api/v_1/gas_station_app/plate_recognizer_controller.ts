import { readFile } from 'node:fs/promises'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlateRecognizerController {
  async store({ request, response }: HttpContext) {
    const image = request.file('upload', {
      size: '50mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
    })

    if (!image) {
      return response.status(422).json({ message: 'A imagem e obrigatoria' })
    }

    if (!image.isValid) {
      return response.status(422).json({
        message: 'Arquivo de imagem invalido',
        errors: image.errors,
      })
    }

    if (!image.tmpPath) {
      return response.status(422).json({
        message: 'Nao foi possivel processar a imagem enviada',
      })
    }

    const regions = request.input('regions')
    const formData = new FormData()
    const contentType = image.type && image.subtype ? `${image.type}/${image.subtype}` : undefined
    const fileBytes = await readFile(image.tmpPath)
    const fileName = image.clientName || `image.${image.extname ?? 'jpg'}`

    formData.append('upload', new Blob([fileBytes], { type: contentType }), fileName)

    for (const region of normalizeRegions(regions)) {
      formData.append('regions', region)
    }

    try {
      const upstreamResponse = await fetch(
        new URL('/v1/plate-reader/', env.get('PLATE_RECOGNIZER_BASE_URL')),
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${secret('PLATE_RECOGNIZER_TOKEN')}`,
          },
          body: formData,
          signal: AbortSignal.timeout(30000),
        }
      )

      const data = await parseResponse(upstreamResponse)

      if (!upstreamResponse.ok) {
        return response.status(upstreamResponse.status).json(
          data ?? {
            message: 'Falha ao processar a imagem no Plate Recognizer',
          }
        )
      }

      return response.ok(data)
    } catch {
      return response.status(502).json({
        message: 'Falha ao consultar o Plate Recognizer',
      })
    }
  }
}

function normalizeRegions(value: unknown) {
  const values = Array.isArray(value) ? value : [value ?? 'br']

  return values
    .map((region) => `${region}`.trim().toLowerCase())
    .filter((region) => region.length > 0)
}

async function parseResponse(response: Response) {
  const text = await response.text()
  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function secret(key: 'PLATE_RECOGNIZER_TOKEN') {
  const value = env.get(key) as unknown as string | { release: () => string }
  if (typeof value === 'object') {
    return value.release()
  }

  return value
}
