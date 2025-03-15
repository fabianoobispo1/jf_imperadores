'use client'

import { ColumnDef } from '@tanstack/react-table'
import { fetchMutation } from 'convex/nextjs'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'

import type { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'

import ActionCell from './ActionCell'

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
  cod_seletiva?: string
}

export const transactionColumns = (onListUpdate: () => Promise<void>): ColumnDef<Seletivas>[] => [
  {
    id: 'image',
    header: 'Foto',
    cell: ({ row }) => {
      const seletiva = row.original
      const ImageCell = () => {
        const [isUploading, setIsUploading] = useState(false)
        const startUpload = useCallback(async (files: File[]) => {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({ files }),
          })
          return response.json()
        }, [])
        const handleFileUpload = useCallback(
          async (file: File) => {
            if (isUploading) return
            setIsUploading(true)

            try {
              const uploadResult = await startUpload([file])
              if (uploadResult && uploadResult[0]) {
                await fetchMutation(api.seletiva.updateImg, {
                  id: seletiva._id,
                  img_link: uploadResult[0].url,
                })
                await onListUpdate()
              }
            } catch (error) {
              console.error('Upload failed:', error)
            } finally {
              setIsUploading(false)
            }
          },
          [isUploading, startUpload]
        )

        return (
          <div className="flex items-center gap-2">
            {seletiva.img_link ? (
              <Image
                src={seletiva.img_link}
                alt={seletiva.nome}
                className="h-20 w-20 rounded-full object-cover"
                width={80}
                height={80}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-20 h-20 rounded-full"
                disabled={isUploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="hidden"
                />
              </Button>
            )}
          </div>
        )
      }
      return <ImageCell />
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
