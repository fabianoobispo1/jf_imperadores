'use client'
import { ModeSwitcherTheme } from '@/components/mode-switcher-theme'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { signOut } from 'next-auth/react'
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="fixed top-4 right-4 z-50">
        <ModeSwitcherTheme />
      </div>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-start space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Bem Vindo 👋</h2>
          <Button onClick={() => signOut()}>
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}
