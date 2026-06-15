/// <reference path="../types/heic_convert.d.ts" />

import { readFile } from 'node:fs/promises'
import heicConvert from 'heic-convert'
import sharp from 'sharp'

const heicExtensions = new Set(['heic', 'heif'])

export function isHeicExtension(extension?: string | null) {
  return heicExtensions.has(extension?.toLowerCase() ?? '')
}

export async function convertHeicPathToJpegBuffer(imagePath: string) {
  return convertHeicBufferToJpegBuffer(await readFile(imagePath))
}

export async function convertImageBufferToJpegBuffer(buffer: Buffer) {
  try {
    return await sharp(buffer).rotate().jpeg().toBuffer()
  } catch {
    return convertHeicBufferToJpegBuffer(buffer)
  }
}

async function convertHeicBufferToJpegBuffer(buffer: Buffer) {
  try {
    return await sharp(buffer).rotate().jpeg().toBuffer()
  } catch {
    const converted = await heicConvert({
      buffer,
      format: 'JPEG',
      quality: 1,
    })

    return Buffer.isBuffer(converted) ? converted : Buffer.from(new Uint8Array(converted))
  }
}
