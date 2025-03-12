import { Metadata } from 'next'

import { ModeSwitcherTheme } from '@/components/mode-switcher-theme'
import { ScrollArea } from '@/components/ui/scroll-area'

export const metadata: Metadata = {
  title: 'Seletiva jf imperadores',
  description: 'Pagina para cadastro',
  keywords: '',
}

export default function seletiva() {
  return (
    <ScrollArea className="h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ModeSwitcherTheme />
      </div>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col items-start gap-2 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Seletiva 2025 - Juiz de Fora Imperadores - Finalizada.
          </h2>
          <p>Resultado em breve</p>
          {/*     <p className="text-sm text-muted-foreground">
            Bem-vindo ao Juiz de Fora Imperadores. Este formulário deve ser
            preenchido por todos que queiram participar da 2ª chamada da 1ª
            seletiva do JF Imperadores de 2025.
          </p>
          <p className="text-sm text-muted-foreground">
            A 2ª chamada da seletiva será realizada no dia 26 de Janeiro.
            Horário: 9 horas Local: Ginásio da SEL - Rua custódio trsitão, 11 -
            Santa Terezinha
          </p> */}
        </div>
        {/*         <SeletivaForm /> */}
      </div>
    </ScrollArea>
  )
}
