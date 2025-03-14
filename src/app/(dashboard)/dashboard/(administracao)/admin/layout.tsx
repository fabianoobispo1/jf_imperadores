import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'

export const metadata: Metadata = {
  title: 'JF Imperadores',
  description: 'JF Imperadores',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) redirect('/')
  if (session?.user.role !== 'admin') redirect('/dashboard')
  return <>{children}</>
}