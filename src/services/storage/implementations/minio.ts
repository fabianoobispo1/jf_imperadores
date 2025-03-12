import S3 from 'aws-sdk/clients/s3'

import type { IStorageProvider } from '../interface'
import { CONFIG } from '../config'

export class MinioStorageProvider implements IStorageProvider {
  client: S3

  constructor() {
    this.client = new S3({
      endpoint: CONFIG.providers.storage.endpoint,
      apiVersion: 'latest',
      accessKeyId: CONFIG.providers.storage.accessKeyId,
      secretAccessKey: CONFIG.providers.storage.secretAccessKey,
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
    })
  }

  async upload(file: File): Promise<{ url: string; key: string }> {
    // Converter o File/Blob para Buffer
    const buffer = await file.arrayBuffer().then(Buffer.from)
    const key = `${Date.now()}-${file.name}` // Gerando key única

    const params = {
      Bucket: CONFIG.providers.storage.bucket as string,
      Key: key,
      Body: buffer, // Usar o buffer ao invés do arquivo direto
      ACL: 'public-read',
      ContentType: file.type, // Adicionar o tipo do conteúdo
    }

    try {
      console.log(CONFIG.providers.storage)
      const response = await this.client.upload(params).promise()
      return {
        url: response.Location,
        key,
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Erro ao fazer upload do arquivo')
    }
  }

  async delete(path: string): Promise<void> {
    const params = {
      Bucket: CONFIG.providers.storage.bucket as string,
      Key: path,
    }

    try {
      await this.client.deleteObject(params).promise()
    } catch (error) {
      console.error('Delete error:', error)
      throw new Error('Error deleting file')
    }
  }
}
