'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { NumericFormat } from 'react-number-format'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { Id } from '@/convex/_generated/dataModel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DatePickerSimple } from '@/components/date-picker-simple'

const formSchema = z.object({
  tipo: z.enum(['receita', 'despesa']),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  data: z.preprocess(
    (val) => {
      // Transforma null em undefined
      if (val === null) return undefined
      // Se já for um número (timestamp), mantém como está
      if (typeof val === 'number') return val
      return undefined
    },
    z
      .number({
        required_error: 'A data precisa ser preenchida.',
      })
      .optional()
  ),
  categoria: z.enum(['mensalidade', 'equipamento', 'viagem', 'patrocinio', 'evento', 'outros']),
  status: z.enum(['pendente', 'confirmado']),
  comprovante: z.any().optional(),
  observacao: z.string().optional(),
})

type TransacaoFormValues = z.infer<typeof formSchema>

interface TransacaoFormProps {
  onSuccess?: () => void
  id?: string
}
export function TransacaoForm({ onSuccess, id }: TransacaoFormProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const create = useMutation(api.financas.create)
  const update = useMutation(api.financas.update)

  const form = useForm<TransacaoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: 'despesa',
      status: 'pendente',
      data: Date.now(),
      descricao: '',
      valor: 0,
      categoria: 'outros',
      observacao: '',
    },
  })

  const transacao = useQuery(
    api.financas.getById,
    id && session?.user?.id
      ? {
          id: id as Id<'financas'>,
          userId: session.user.id as string,
        }
      : 'skip'
  )

  // Effect para preencher o form quando os dados chegarem
  useEffect(() => {
    if (transacao) {
      form.reset({
        tipo: transacao.tipo,
        descricao: transacao.descricao,
        valor: transacao.valor,
        data: transacao.data,
        categoria: transacao.categoria,
        status: transacao.status,
        observacao: transacao.observacao || '',
      })
    }
  }, [transacao, form])

  async function onSubmit(data: TransacaoFormValues) {
    try {
      setLoading(true)
      if (!session?.user?.id) return
      if (id) {
        const transacao = await update({
          id: id as Id<'financas'>,
          tipo: data.tipo,
          descricao: data.descricao,
          valor: data.valor,
          data: data.data || Date.now(),
          categoria: data.categoria,
          status: data.status,
          userId: session.user.id as Id<'user'>,
          comprovante_url: data.comprovante?.url,
          comprovante_key: data.comprovante?.key,
          observacao: data.observacao,
        })
        console.log(transacao)
      } else {
        const transacao = await create({
          tipo: data.tipo,
          descricao: data.descricao,
          valor: data.valor,
          data: data.data || Date.now(),
          categoria: data.categoria,
          status: data.status,
          created_at: Date.now(),
          updated_at: Date.now(),
          userId: session.user.id as Id<'user'>,
          comprovante_url: data.comprovante?.url,
          comprovante_key: data.comprovante?.key,
          observacao: data.observacao,
        })
        console.log(transacao)
      }
      onSuccess?.()
      toast.success('Ok', {
        description: 'Transação registrada com sucesso',
        duration: 3000,
        richColors: true,
      })

      form.reset()
    } catch (error) {
      console.error(error)
      toast.error('Erro', {
        description: 'Ocorreu um erro ao registrar a transação',
        duration: 3000,
        richColors: true,
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-full overflow-x-auto ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Categoria</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mensalidade">Mensalidade</SelectItem>
                      <SelectItem value="equipamento">Equipamento</SelectItem>
                      <SelectItem value="viagem">Viagem</SelectItem>
                      <SelectItem value="patrocinio">Patrocínio</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Digite a descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue)
                      }}
                      prefix="R$ "
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                      fixedDecimalScale
                      disabled={loading}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Data pagamento/recebimento</FormLabel>
                  <FormControl>
                    <DatePickerSimple
                      timestamp={field.value}
                      setTimestamp={(newTimestamp) => {
                        field.onChange(newTimestamp)
                      }}
                      placeholder="Selecione a data"
                      disabledDays={(date: Date) => false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Status</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="observacao"
            render={({ field }) => (
              <FormItem className="flex flex-col px-1">
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea disabled={loading} placeholder="Observações adicionais" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Transação'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}
