import { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { z } from 'zod'
import { compare } from 'bcryptjs'

import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

async function getUser(identifier: { key: string; value: string }) {
  let user
  if (identifier.key === 'email')
    user = fetchQuery(api.user.getByEmail, { email: identifier.value })

  return user
}

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '' /* ,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      } */,
    }),
    CredentialProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          throw new Error('Credenciais inválidas')
        }

        const { email, password } = parsedCredentials.data

        const user = await getUser({
          key: email ? 'email' : 'username',
          value: email,
        })
        if (!user) {
          throw new Error('Usuário não encontrado')
        }
        if (user.password === '') {
          throw new Error('Entrar com provider')
        }

        const isMatch = await compare(password, user.password)
        if (!isMatch) {
          throw new Error('Senha incorreta')
        }

        // Atualiza o último login após autenticação bem sucedida
        await fetchMutation(api.user.UpdateLastLogin, {
          userId: user._id,
          last_login: Date.now(),
        })
        return {
          id: user._id.toString(),
          image: user.image || '',
          email: user.email,
          role: user.role,
          nome: user.nome,
        }
      },
    }),
  ],
  pages: {
    signIn: '/entrar',
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'github' || account?.provider === 'google') {
        // console.log('account ✔')
        // console.log(account)
        // console.log('profile ✔')
        // console.log(profile)
        const provider = account?.provider
        const email = profile?.email

        let image = ''
        if (provider === 'google') {
          image = profile?.picture
        }

        if (email) {
          const usuario = await getUser({ key: 'email', value: email })

          if (!usuario) {
            const createUser = await fetchMutation(api.user.create, {
              password: '',
              provider,
              email,
              role: 'user',
              image,
              nome: String(profile.name),
              last_login: Date.now(),
            })
            user.image = String(profile?.image)
            user.nome = String(profile?.name)
            user.id = String(createUser)
            user.role = 'user'
          } else {
            const updateeUser = await fetchMutation(api.user.UpdateUserLogin, {
              userId: usuario._id as Id<'user'>,
              image,
              provider,
              password: '',
              last_login: Date.now(),
            })
            user.image = String(updateeUser?.image)
            user.nome = String(updateeUser?.nome)
            user.id = String(updateeUser?._id)
            user.role = String(updateeUser?.role)
          }
        }
      }

      return true
    },
    async jwt({ token, user }) {
      // console.log('JWT Callback - Token antes:', token)
      // console.log('JWT Callback - User:', user)
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.image = user.image as string
        token.nome = user.nome as string
      }
      // console.log('JWT Callback - Token depois:', token)
      return token
    },

    async session({ session, token }) {
      // console.log('Session Callback - Token:', token)
      // console.log('Session Callback - Session antes:', session)
      if (token.role) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.image = token.image
        session.user.nome = token.nome
      }
      // console.log('Session Callback - Session depois:', session)
      return session
    },
  },
  jwt: {
    maxAge: 60 * 60, // 1 h
  },
} satisfies NextAuthConfig

export default authConfig
