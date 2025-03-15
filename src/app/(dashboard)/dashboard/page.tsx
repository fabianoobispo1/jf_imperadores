import DadosIniciais from '@/components/DadosIniciais'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-start space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Bem Vindo 👋</h2>
        </div>
        <DadosIniciais />
      </div>
    </ScrollArea>
  )
}
