'use client'
import { useEffect, useState } from 'react'
import { ImageIcon, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MinioStorageProvider } from '@/services/storage/implementations/minio'
import { toast } from 'sonner'
import Image from 'next/image'
import type { Id } from '@/convex/_generated/dataModel'

interface ImageUploadSeletivaProps {
  value: { url: string; key: string } | null
  onChange: (data: { url: string; key: string } | null) => void
  disabled?: boolean
  seletivaId: Id<'seletiva'>
}

export const ImageUploadSeletiva = ({
  value,
  onChange,
  disabled,
  seletivaId,
}: ImageUploadSeletivaProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const storage = new MinioStorageProvider()
  const inputId = `imageInput-${seletivaId}`

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const removeOldImage = async () => {
    if (value?.key) {
      try {
        await storage.delete(value.key)
      } catch (error) {
        console.error('Erro ao remover imagem antiga:', error)
      }
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true)
      console.log('Upload para seletiva ID:', seletivaId)
      if (e.target.files?.[0]) {
        if (value?.key) {
          await removeOldImage()
        }

        const file = e.target.files[0]
        const result = await storage.upload(file)
        onChange(result)
        toast.success('Ok', {
          description: 'Imagem atualizada com sucesso!',
          duration: 3000,
          richColors: true,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro', {
        description: 'Erro ao fazer upload da imagem.',
        duration: 3000,
        richColors: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    try {
      setLoading(true)
      await removeOldImage()
      onChange(null)
      toast.success('Ok', {
        description: 'Imagem removida com sucesso!',
        duration: 3000,
        richColors: true,
      })
    } catch (error) {
      console.error(error)
      toast.error('Erro', {
        description: 'Erro ao remover imagem.',
        duration: 3000,
        richColors: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        {value?.url ? (
          <>
            <Image
              src={value.url}
              alt={value.key}
              className="h-20 w-20 rounded-full object-cover"
              width={80}
              height={80}
            />

            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={() => document.getElementById(inputId)?.click()}
                disabled={disabled || loading}
              >
                <Upload className="h-4 w-4" />
              </Button>

              {/* Botão de deletar só aparece quando há uma imagem */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemove}
                disabled={disabled || loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-20 h-20 rounded-full"
            disabled={disabled || loading}
            onClick={() => document.getElementById(inputId)?.click()}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            <input
              id={inputId}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </Button>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={disabled || loading}
        className="hidden"
      />
    </div>
  )
}
