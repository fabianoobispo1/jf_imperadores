import NextAuth, { type DefaultSession, type DefaultJWT } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    nome: string
    role: string
    image: string
  }
  interface Session {
    user: {
      id: string
      role: string
      nome: string
      image: string
    } & DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: string
    nome: string
    image: string
  }
}
