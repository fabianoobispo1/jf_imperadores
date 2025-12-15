'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ModeSwitcherTheme } from '@/components/mode-switcher-theme'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

export default function VendaCamisaPage() {
  const vendas = useQuery(api.vendacamisa.getAll)
  const [searchTerm, setSearchTerm] = useState('')

  // Agrupar camisas por nome e tamanho
  const agrupadosPorNomeTamanho = useMemo(() => {
    if (!vendas) return {}

    const grupos: Record<string, Record<string, any[]>> = {}

    vendas.forEach((camisa) => {
      if (!grupos[camisa.nome]) {
        grupos[camisa.nome] = {}
      }
      if (!grupos[camisa.nome][camisa.tamanho]) {
        grupos[camisa.nome][camisa.tamanho] = []
      }
      grupos[camisa.nome][camisa.tamanho].push(camisa)
    })

    return grupos
  }, [vendas])

  // Filtrar por pesquisa
  const filtrados = useMemo(() => {
    if (!searchTerm) return agrupadosPorNomeTamanho

    const filtered: Record<string, Record<string, any[]>> = {}

    Object.entries(agrupadosPorNomeTamanho).forEach(([nome, tamanhos]) => {
      Object.entries(tamanhos).forEach(([tamanho, camisas]) => {
        const match = camisas.some(
          (c) =>
            c.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.tamanho.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )

        if (match) {
          if (!filtered[nome]) filtered[nome] = {}
          filtered[nome][tamanho] = camisas.filter(
            (c) =>
              c.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.tamanho.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
      })
    })

    return filtered
  }, [agrupadosPorNomeTamanho, searchTerm])

  if (vendas === undefined) {
    return (
      <ScrollArea className="h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Carregando...</div>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ModeSwitcherTheme />
      </div>

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Camisas</h1>
          <p className="text-muted-foreground">
            Confira a disponibilidade de camisas do JF Imperadores
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Pesquisar por número ou tamanho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Camisas por nome */}
        <div className="space-y-8">
          {Object.entries(filtrados).map(([nomeCamisa, tamanhos]) => (
            <div key={nomeCamisa}>
              <h2 className="text-2xl font-bold tracking-tight mb-4">{nomeCamisa}</h2>

              {/* Grid de tamanhos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(tamanhos)
                  .sort((a, b) => {
                    // Ordenar tamanhos de forma lógica
                    const ordem = ['PP', 'P', 'M', 'G', 'GG', '4G', '5G', 'XGG', 'XXGG']
                    return ordem.indexOf(a[0]) - ordem.indexOf(b[0])
                  })
                  .map(([tamanho, camisas]) => (
                    <Card key={`${nomeCamisa}-${tamanho}`} className="p-4">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg">Tamanho: {tamanho}</h3>
                        <p className="text-sm text-muted-foreground">
                          {camisas.length} unidade{camisas.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Lista de números */}
                      <div className="flex flex-wrap gap-2">
                        {camisas.map((camisa) => (
                          <span
                            key={camisa._id}
                            className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            #{camisa.numero}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total de camisas */}
        {vendas && (
          <div className="mt-12 pt-8 border-t">
            <p className="text-muted-foreground">
              Total de camisas disponíveis:{' '}
              <span className="font-bold text-foreground text-lg">{vendas.length}</span>
            </p>
          </div>
        )}

        {Object.keys(filtrados).length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhuma camisa encontrada para "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
