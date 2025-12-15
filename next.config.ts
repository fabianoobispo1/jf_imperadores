import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Só use isso em desenvolvimento
  },
  webpack: (config) => {
    // Ignore canvas module from pdfjs-dist (only used in Node.js, not in browser)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      path: false,
    }
    return config
  },
  env: {
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_BUCKET: process.env.MINIO_BUCKET,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**', // Permite qualquer caminho
      },
      {
        protocol: 'https',
        hostname: 'gravatar.com',
        pathname: '/**', // Permite qualquer caminho
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**', // Permite qualquer caminho
      },
      {
        protocol: 'https',
        hostname: 'limitless-bullfrog-897.convex.cloud',
        pathname: '/**', // Permite qualquer caminho
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        pathname: '/**', // Permite qualquer caminho
      },
      {
        protocol: 'https',
        hostname: 'strong-reindeer-272.convex.cloud',
        pathname: '/**', // Permite qualquer caminho
      },
      {
        protocol: 'https',
        hostname: 'minioapi.fabianoobispo.com.br', // adicione seu domínio MinIO
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
