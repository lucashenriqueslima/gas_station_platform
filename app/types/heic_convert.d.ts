declare module 'heic-convert' {
  type ConvertOptions = {
    buffer: Buffer
    format: 'JPEG' | 'PNG'
    quality?: number
  }

  type ConvertAllResult = {
    convert: () => Promise<ArrayBuffer | Buffer>
  }

  type HeicConvert = {
    (options: ConvertOptions): Promise<ArrayBuffer | Buffer>
    all: (options: ConvertOptions) => Promise<ConvertAllResult[]>
  }

  const convert: HeicConvert
  export default convert
}
