'use client'
import { ColumnDef } from '@tanstack/react-table'
import { fetchMutation } from 'convex/nextjs'

import type { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'

import ActionCell from './ActionCell'
import { ImageUploadSeletiva } from './image-upload-seletiva'

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

export const transactionColumns = (onListUpdate: () => Promise<void>): ColumnDef<Seletivas>[] => [
  {
    id: 'image',
    header: 'Foto',
    cell: ({ row }) => {
      const seletiva = row.original

      // Cria um ID único para este componente de upload baseado no ID da seletiva
      const uploadId = `upload-${seletiva._id}`

      return (
        <div key={uploadId}>
          <ImageUploadSeletiva
            seletivaId={seletiva._id as Id<'seletiva'>}
            value={{
              url: seletiva.img_link || '',
              key: seletiva.img_key || '',
            }}
            onChange={async (imageData) => {
              console.log('Atualizando imagem para seletiva:', seletiva._id, seletiva.nome)

              if (imageData) {
                await fetchMutation(api.seletiva.updateImg, {
                  id: seletiva._id as Id<'seletiva'>,
                  img_link: imageData.url,
                  img_key: imageData.key,
                })
              } else {
                await fetchMutation(api.seletiva.updateImg, {
                  id: seletiva._id as Id<'seletiva'>,
                  img_link: '',
                  img_key: '',
                })
              }

              // Atualizar a lista após o upload
              await onListUpdate()
            }}
          />
        </div>
      )
    },
  },

  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'cod_seletiva',
    header: 'Cod. Seletiva',
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
    cell: ({ row }) => <ActionCell seletiva={row.original} onListUpdate={onListUpdate} />,
  },
]
