import '#helpers/tensorflow_node'

import * as faceapi from '@vladmandic/face-api'
import canvas from 'canvas'
import app from '@adonisjs/core/services/app'
import {
  convertHeicPathToJpegBuffer,
  convertImageBufferToJpegBuffer,
  isHeicExtension,
} from '#helpers/image_converter'

const { Canvas, Image, ImageData, loadImage } = canvas

faceapi.env.monkeyPatch({
  Canvas: Canvas as any,
  Image: Image as any,
  ImageData: ImageData as any,
})

export type FaceDescriptor = number[]

export type FaceMatchCandidate<T = unknown> = {
  data: T
  descriptor: FaceDescriptor
}

export type FaceMatchResult<T = unknown> = {
  data: T
  distance: number
  confidence: number
  matched: boolean
}

export default class FaceRecognitionService {
  private loaded = false

  /**
   * Threshold padrão do face-api costuma ser 0.6.
   * Quanto menor, mais rigoroso.
   */
  private readonly defaultThreshold = 0.6

  async loadModels() {
    if (this.loaded) {
      return
    }

    const modelsPath = app.publicPath('models')

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath)
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)

    this.loaded = true
  }

  async getDescriptorFromPath(imagePath: string): Promise<FaceDescriptor> {
    await this.loadModels()

    const image = await this.loadImageFromPath(imagePath)

    const detection = await faceapi
      .detectSingleFace(image as any)
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      throw new Error('Nenhum rosto encontrado na imagem')
    }

    return Array.from(detection.descriptor)
  }

  async getDescriptorFromBuffer(buffer: Buffer): Promise<FaceDescriptor> {
    await this.loadModels()

    const image = await loadImage(await convertImageBufferToJpegBuffer(buffer))

    const detection = await faceapi
      .detectSingleFace(image as any)
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      throw new Error('Nenhum rosto encontrado na imagem')
    }

    return Array.from(detection.descriptor)
  }

  compareDescriptors(descriptorA: FaceDescriptor, descriptorB: FaceDescriptor) {
    return faceapi.euclideanDistance(new Float32Array(descriptorA), new Float32Array(descriptorB))
  }

  findBestMatch<T>(
    inputDescriptor: FaceDescriptor,
    candidates: FaceMatchCandidate<T>[],
    threshold = this.defaultThreshold
  ): FaceMatchResult<T> | null {
    let bestMatch: FaceMatchResult<T> | null = null

    for (const candidate of candidates) {
      const distance = this.compareDescriptors(inputDescriptor, candidate.descriptor)

      const confidence = Math.max(0, Math.min(1, 1 - distance))

      if (!bestMatch || distance < bestMatch.distance) {
        bestMatch = {
          data: candidate.data,
          distance,
          confidence,
          matched: distance <= threshold,
        }
      }
    }

    return bestMatch
  }

  private async normalizeImageInput(imagePath: string) {
    if (!isHeicExtension(this.getExtension(imagePath))) {
      return imagePath
    }

    return convertHeicPathToJpegBuffer(imagePath)
  }

  private async loadImageFromPath(imagePath: string) {
    try {
      return await loadImage(await this.normalizeImageInput(imagePath))
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unsupported image type')) {
        return loadImage(await convertHeicPathToJpegBuffer(imagePath))
      }

      throw error
    }
  }

  private getExtension(path: string) {
    return path.split('.').pop()?.toLowerCase() ?? ''
  }
}
