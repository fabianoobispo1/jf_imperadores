'use client'
import { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

import type { Id } from '../../../../../../../convex/_generated/dataModel'
import { api } from '../../../../../../../convex/_generated/api'

const formSchema = z
  .object({
    _id: z.string().optional(),
    titulo: z.string().min(1, 'Título é obrigatório'),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    local: z.string().min(1, 'Local é obrigatório'),
    horario: z.string().min(1, 'Horário é obrigatório'),
    status: z.boolean(),
    data_inicio: z.preprocess(
      (val) => (val === null ? undefined : val),
      z.date({
        required_error: 'A data de inicio precisa ser preenchida.',
      })
    ),
    data_fim: z.preprocess(
      (val) => (val === null ? undefined : val),
      z.date({
        required_error: 'A data fim precisa ser preenchida.',
      })
    ),
  })
  .refine(
    (data) => {
      if (data.data_inicio && data.data_fim) {
        return data.data_fim >= data.data_inicio
      }
      return true
    },
    {
      message: 'A data de fim deve ser igual ou posterior à data de início',
      path: ['data_fim'],
    }
  )

type FormValues = z.infer<typeof formSchema>

export const ConfigSeletiva = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const [editingItem, setEditingItem] = useState<FormValues | null>(null)

  const update = useMutation(api.seletivaConfig.updateConfig)
  const seletivas = useQuery(api.seletivaConfig.getAllConfig) || []
  const create = useMutation(api.seletivaConfig.createConfig)
  const deleteMutation = useMutation(api.seletivaConfig.deleteConfig)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      local: '',
      horario: '',
      status: false,
      data_inicio: undefined,
      data_fim: undefined,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)

      // Garantir que as datas estão no formato correto
      const dataInicio = data.data_inicio ? new Date(data.data_inicio) : new Date()
      dataInicio.setHours(12, 0, 0, 0) // Meio-dia para evitar problemas de fuso

      const dataFim = data.data_fim ? new Date(data.data_fim) : new Date()
      dataFim.setHours(12, 0, 0, 0)

      if (editingItem) {
        await update({
          id: editingItem._id as Id<'seletivaConfig'>,
          titulo: data.titulo,
          descricao: data.descricao,
          local: data.local,
          horario: data.horario,
          status: data.status,
          data_inicio: dataInicio.getTime(),
          data_fim: dataFim.getTime(),
        })
        toast.success('Ok', {
          description: 'Seletiva atualizada com sucesso',
          duration: 3000,
          richColors: true,
        })
      } else {
        await create({
          titulo: data.titulo,
          descricao: data.descricao,
          local: data.local,
          horario: data.horario,
          status: data.status,
          data_inicio: dataInicio.getTime(),
          data_fim: dataFim.getTime(),
          created_at: Date.now(),
        })
        toast.success('Ok', {
          description: 'Seletiva criada com sucesso',
          duration: 3000,
          richColors: true,
        })
      }

      setShowModal(false)
      setEditingItem(null)
      form.reset()
    } catch (error) {
      console.log(error)
      toast.error('Erro', {
        description: 'Ocorreu um erro ao criar a seletiva',
        duration: 3000,
        richColors: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteSeletiva = async (id: string | undefined) => {
    if (!id) {
      toast.error('Erro', {
        description: 'ID da seletiva não encontrado',
        duration: 3000,
        richColors: true,
      })
      return
    }
    try {
      await deleteMutation({ seletivaConfigId: id as Id<'seletivaConfig'> })
      toast.success('Ok', {
        description: 'Seletiva excluída com sucesso',
        duration: 3000,
        richColors: true,
      })
    } catch (error) {
      console.error(error)
      toast.error('Erro', {
        description: 'Ocorreu um erro ao excluir a seletiva',
        duration: 3000,
        richColors: true,
      })
    }
  }

  const columns = [
    {
      accessorKey: 'titulo',
      header: 'Título',
    },
    {
      accessorKey: 'data_inicio',
      header: 'Data Início',
      cell: ({ row }: { row: { getValue: (key: string) => Date } }) =>
        format(row.getValue('data_inicio'), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'data_fim',
      header: 'Data Fim',
      cell: ({ row }: { row: { getValue: (key: string) => Date } }) =>
        format(row.getValue('data_fim'), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'local',
      header: 'Local',
    },
    {
      accessorKey: 'horario',
      header: 'Horário',
    },
    {
      accessorKey: 'status',
      header: 'Status',

      cell: ({ row }: { row: { getValue: (key: string) => boolean } }) => (
        <span className={row.getValue('status') ? 'text-green-600' : 'text-red-600'}>
          {row.getValue('status') ? 'Ativa' : 'Inativa'}
        </span>
      ),
    },
    {
      id: 'actions',

      cell: ({ row }: { row: { original: FormValues } }) => {
        const seletiva = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingItem(seletiva)
                setShowModal(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                deleteSeletiva(seletiva._id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (editingItem) {
      form.reset({
        titulo: editingItem.titulo,
        descricao: editingItem.descricao,
        local: editingItem.local,
        horario: editingItem.horario,
        status: editingItem.status,
        data_inicio: editingItem.data_inicio ? new Date(editingItem.data_inicio) : undefined,
        data_fim: editingItem.data_fim ? new Date(editingItem.data_fim) : undefined,
      })
    }
  }, [editingItem, form])

  const formattedSeletivas = seletivas.map((seletiva) => ({
    ...seletiva,
    data_inicio: new Date(seletiva.data_inicio),
    data_fim: new Date(seletiva.data_fim),
  }))

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Configuração de Seletivas"
          description="Gerencie os períodos de seletivas"
        />
        <Button onClick={() => setShowModal(true)}>Nova Seletiva</Button>
      </div>

      <DataTable columns={columns} data={formattedSeletivas} searchKey="titulo" />

      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open)
          if (!open) {
            setEditingItem(null)
            form.reset()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Seletiva' : 'Nova Seletiva'}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Título da seletiva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} placeholder="Descrição da seletiva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Inicio</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={loading}
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          // Converte a string da data para um objeto Date
                          const date = new Date(e.target.value)
                          // Corrige fuso horário para evitar problemas de data
                          date.setHours(12, 0, 0, 0)
                          // Atualiza o campo com o objeto Date
                          field.onChange(date)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_fim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fim</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={loading}
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          // Converte a string da data para um objeto Date
                          const date = new Date(e.target.value)
                          // Corrige fuso horário para evitar problemas de data
                          date.setHours(12, 0, 0, 0)
                          // Atualiza o campo com o objeto Date
                          field.onChange(date)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Local da seletiva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Horário da seletiva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Seletiva Ativa</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {editingItem ? 'Atualizando...' : 'Criando...'}
                    </span>
                  ) : editingItem ? (
                    'Atualizar'
                  ) : (
                    'Criar'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
