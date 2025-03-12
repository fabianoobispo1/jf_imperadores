import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export const metadata: Metadata = {
  title: 'JF Imperadores',
  description: 'JF Imperadores',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) redirect('/')
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/*       <SidebarTrigger title="Menu" /> */}
        {children}
      </main>
    </SidebarProvider>
  )
}
