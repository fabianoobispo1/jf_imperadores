'use client'
import { useSession } from 'next-auth/react'

export function VerificaAdmin() {
  const { data: session } = useSession()

  if (session) {
    if (session.user.role !== 'admin') {
      window.location.href = '/dashboard'
    }
  }

  return <></>
}
