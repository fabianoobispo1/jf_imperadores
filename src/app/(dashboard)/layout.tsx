import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ModeSwitcherTheme } from '@/components/mode-switcher-theme'

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
      <div className="flex flex-col flex-1">
        <div className="pt-4 px-2 flex items-center justify-between">
          <SidebarTrigger title="Menu" />
          <ModeSwitcherTheme />
        </div>
        <main className="w-full">{children}</main>
      </div>
    </SidebarProvider>
  )
}
