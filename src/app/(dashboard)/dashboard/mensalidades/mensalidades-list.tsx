'use-client'
import { fetchQuery } from 'convex/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface Mensalidade {
  _id: Id<'mensalidade'>
  _creationTime: number
  tipo: 'avulsa' | 'recorrente'
  email: string
  customer: string
  id_payment_stripe: string
  valor: number
  data_pagamento: number
  data_cancelamento: number
  cancelado: boolean
  nome: string
  mes_referencia: string
}

export const MensalidadesList: React.FC = () => {
  const { open } = useSidebar()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([])

  const loadList = async () => {
    setLoading(true)
    try {
      const allMensalidades = await fetchQuery(api.mensalidade.getAll, {})
      console.log(allMensalidades)
      setMensalidades(allMensalidades)
    } catch (error) {
      console.error('Erro ao buscar Mensalidades:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadList()
  }, [])

  return (
    <div
      className={cn(
        'space-y-4 w-screen pr-4 ',
        open ? 'md:max-w-[calc(100%-16rem)] ' : 'md:max-w-[calc(100%-7rem)] ',
      )}
    >
      <Button
        onClick={() => {
          router.push('/dashboard/mensalidades/cadastrar')
        }}
      >
        Adicionar Mensalidade
      </Button>

      <div className="w-full overflow-auto">
        <div className="w-full pr-4">
          {/* Largura mínima para garantir que todas as colunas fiquem visíveis */}
          <ScrollArea className="h-[calc(80vh-220px)] w-full  rounded-md border ">
            <Table>
              <TableHeader className="sticky top-0 bg-background ">
                <TableRow>
                  <TableHead className="text-center min-w-[400px]">
                    Nome
                  </TableHead>
                  <TableHead className="text-center min-w-[120px]">
                    mês referência
                  </TableHead>
                  <TableHead className="text-center min-w-[300px]">
                    Data Pagamento
                  </TableHead>
                  <TableHead className="text-center min-w-[50px]">
                    Tipo
                  </TableHead>
                  <TableHead className="text-center min-w-[50px]">
                    Valor
                  </TableHead>
                  <TableHead className="text-center min-w-[300px]">
                    meio de pagamento
                  </TableHead>

                  <TableHead className="text-center">Opções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      <Spinner />
                    </TableCell>
                  </TableRow>
                ) : (
                  mensalidades.map((mensalidade) => (
                    <TableRow key={mensalidade._id}>
                      <TableCell className="text-center">
                        {mensalidade.nome}
                      </TableCell>
                      <TableCell className="text-center">
                        {mensalidade.mes_referencia}
                      </TableCell>
                      <TableCell className="text-center">
                        {mensalidade.data_pagamento
                          ? new Date(
                              mensalidade.data_pagamento,
                            ).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {mensalidade.tipo}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(mensalidade.valor)}
                      </TableCell>
                      <TableCell className="text-center">
                        {mensalidade.id_payment_stripe === 'manual'
                          ? 'Manual'
                          : 'Stripe'}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`#`}>Remover</Link>
                            </DropdownMenuItem>
                            {/*  <DropdownMenuItem>
                              <Link href={`#`}>Avaliações</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`#`}>Histórico</Link>
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
