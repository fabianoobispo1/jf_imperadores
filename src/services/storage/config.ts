export const CONFIG = {
  providers: {
    storage: {
      provider: 'MINIO',
      endpoint: process.env.MINIO_ENDPOINT,
      bucket: process.env.MINIO_BUCKET,
      accessKeyId: process.env.MINIO_ACCESS_KEY,
      secretAccessKey: process.env.MINIO_SECRET_KEY,
      signatureVersion: 'v4',
    },
  },
}
