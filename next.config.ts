import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Só use isso em desenvolvimento
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
    ],
  },
}

export default nextConfig
