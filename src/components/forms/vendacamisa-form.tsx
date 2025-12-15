'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Id } from '../../../convex/_generated/dataModel'
import { api } from '../../../convex/_generated/api'

const formSchema = z.object({
  nome: z.string().min(2, { message: 'Nome é obrigatório' }),
  numero: z.string().min(1, { message: 'Número é obrigatório' }),
  tamanho: z.string().min(1, { message: 'Tamanho é obrigatório' }),
})

interface VendacamisaFormProps {
  initialData?: {
    _id: Id<'vendacamisa'>
    nome: string
    numero: string
    tamanho: string
  }
  onSuccess?: () => void
}

export function VendacamisaForm({ initialData, onSuccess }: VendacamisaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const create = useMutation(api.vendacamisa.create)
  const update = useMutation(api.vendacamisa.update)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      numero: initialData?.numero || '',
      tamanho: initialData?.tamanho || '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      if (initialData) {
        await update({
          id: initialData._id,
          ...values,
        })
        toast.success('Venda atualizada com sucesso')
      } else {
        await create({
          ...values,
        })
        toast.success('Venda criada com sucesso')
        form.reset()
      }

      onSuccess?.()
    } catch (error) {
      const err = error as Error
      toast.error(err.message || 'Erro ao salvar venda')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da pessoa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Número da camisa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tamanho"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho</FormLabel>
              <FormControl>
                <Input placeholder="ex: P, M, G, GG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </Button>
      </form>
    </Form>
  )
}
