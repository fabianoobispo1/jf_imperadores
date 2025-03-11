import { ModeSwitcherTheme } from '@/components/mode-switcher-theme'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JF Imperadores',
  description: 'Página oficial do time JF Imperadores',
  keywords:
    'imperadores, jf imperadores, jfimperadores, futebolamericano, futebol ameriacno, fabr, juiz de fora imperadores, time imperadores, time jfimperadores, time jf imperadores',
}

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center ">
      Pagina Inicial
      <ModeSwitcherTheme />
    </div>
  )
}
