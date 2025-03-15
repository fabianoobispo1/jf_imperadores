'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { fetchMutation, fetchQuery } from 'convex/nextjs'

import { DataTable } from '@/components/ui/data-table'
import type { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { Heading } from '@/components/ui/heading'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/ui/sidebar'

import { transactionColumns } from './_columns'

interface Seletivas {
  _id: Id<'seletiva'>
  _creationTime: number
  numerio_seletiva: number
  nome: string
  cpf: string
  data_nascimento?: number
  email: string
  altura: number
  peso: number
  celular: string
  tem_experiencia: boolean
  equipe_anterior: string
  setor: number
  posicao: string
  equipamento: number
  aprovado?: boolean
  img_link?: string
  img_key?: string
  cod_seletiva?: string
}

export const TryoutExercicios: React.FC = () => {
  const { data: session } = useSession()
  const { open } = useSidebar()
  const [seltivas, setSeletivas] = useState<Seletivas[]>([])

  const loadList = useCallback(async () => {
    const allSeletivas = await fetchQuery(api.seletiva.getAll, {})

    const sortedSeletivas = [...allSeletivas].sort((a, b) => {
      return a.nome.localeCompare(b.nome)
    })
    setSeletivas(sortedSeletivas)
  }, [])

  useEffect(() => {
    if (session) {
      loadList()
    }
  }, [loadList, session])

  return (
    <>
      <div className="flexrow flex items-start justify-between gap-4 ">
        <Heading title="Seletiva Exercicios" description="Exercicios feitos no dia da seletiva" />
      </div>

      <div
        className={cn(
          'space-y-8 w-screen pr-8 ',
          open ? 'md:max-w-[calc(100%-16rem)] ' : 'md:max-w-[calc(100%-5rem)] '
        )}
      >
        <DataTable
          searchKey="nome"
          columns={transactionColumns(loadList)} // Modificar aqui para passar a função
          data={JSON.parse(JSON.stringify(seltivas))}
        />
      </div>
    </>
  )
}
