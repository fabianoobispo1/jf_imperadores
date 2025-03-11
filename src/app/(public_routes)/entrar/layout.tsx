import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (session?.user) redirect('/dashboard')

  return <div>{children}</div>
}
