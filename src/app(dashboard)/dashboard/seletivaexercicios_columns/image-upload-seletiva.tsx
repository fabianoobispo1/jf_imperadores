'use client'
import { useState } from 'react'
import { ImageIcon, Trash2, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MinioStorageProvider } from '@/services/storage/implementations/minio'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadSeletivaProps {
  value: { url: string; key: string } | null
  onChange: (data: { url: string; key: string } | null) => void
  disabled?: boolean
}

export const ImageUploadSeletiva = ({ value, onChange, disabled }: ImageUploadSeletivaProps) => {
  const [loading, setLoading] = useState(false)
  const storage = new MinioStorageProvider()

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
          <div className="relative">
            <Image
              src={value.url}
              alt={value.key}
              className="h-20 w-20 rounded-full object-cover"
              width={80}
              height={80}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
              disabled={disabled || loading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-20 h-20 rounded-full"
            disabled={disabled || loading}
            onClick={() => document.getElementById('imageInput')?.click()}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </Button>
        )}
      </div>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={disabled || loading}
        className="hidden"
      />
    </div>
  )
}
