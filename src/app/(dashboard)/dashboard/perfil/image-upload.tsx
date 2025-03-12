'use client'
import { useState } from 'react'
import { ImageIcon, Trash2, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MinioStorageProvider } from '@/services/storage/implementations/minio'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: { url: string; key: string } | null
  onChange: (data: { url: string; key: string } | null) => void
  disabled?: boolean
}

export const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
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
        <Avatar className="h-32 w-32">
          <AvatarImage src={value?.url} alt="Avatar" />
          <AvatarFallback>
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={() => document.getElementById('imageInput')?.click()}
            disabled={disabled || loading}
          >
            <Upload className="h-4 w-4" />
          </Button>

          {value && (
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
          )}
        </div>
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
