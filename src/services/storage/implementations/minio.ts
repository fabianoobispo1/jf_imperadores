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
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.type,
    }

    try {
      // Upload do arquivo
      await this.client.upload(params).promise()

      // Gerar URL pré-assinada com validade longa (1 semana)
      const signedUrl = await this.client.getSignedUrlPromise('getObject', {
        Bucket: CONFIG.providers.storage.bucket as string,
        Key: key,
        Expires: 604800, // 1 semana em segundos
      })

      return {
        url: signedUrl,
        key,
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Erro ao fazer upload do arquivo')
    }
  }

  // Também podemos adicionar um método para obter URL pré-assinada quando precisarmos
  async getSignedUrl(key: string): Promise<string> {
    try {
      const signedUrl = await this.client.getSignedUrlPromise('getObject', {
        Bucket: CONFIG.providers.storage.bucket as string,
        Key: key,
        Expires: 604800, // 1 semana em segundos
      })
      return signedUrl
    } catch (error) {
      console.error('Error getting signed URL:', error)
      throw new Error('Erro ao obter URL assinada')
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
