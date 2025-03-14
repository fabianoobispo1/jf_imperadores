'use client'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { fetchQuery } from 'convex/nextjs'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

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
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/* tipo: v.union(v.literal('avulsa'), v.literal('recorrente')),
email: v.string(),
customer: v.string(),
id_payment_stripe: v.string(),
valor: v.number(),
data_pagamento: v.number(),
data_cancelamento: v.number(),
cancelado: v.boolean(),
 */
const formSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  nome: z.string(),
  valor: z.number(),
  data_pagamento: z.preprocess(
    (val) => (val === null ? undefined : val), // Transforma null em undefined
    z.date({
      required_error: 'A data de pagamento precisa ser preenchida.',
    })
  ),
  mes_referencia: z.string(),
})

interface MensalidadesFormProps {
  initialData?: {
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
  } | null
}

interface ComboboxOption {
  label: string
  value: string
}

export const MensalidadeForm: React.FC<MensalidadesFormProps> = ({ initialData }) => {
  const MESES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ] as const

  const getMesAtual = () => MESES[new Date().getMonth()]

  const { data: session } = useSession()
  const [options, setOptions] = useState<ComboboxOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const create = useMutation(api.mensalidade.create)
  const createTransacao = useMutation(api.financas.create)

  useEffect(() => {
    const loadAtletas = async () => {
      try {
        const response = await fetchQuery(api.atletas.getAllAtivos, {})
        const formattedOptions = (response || []).map((atleta) => ({
          label: atleta.nome,
          value: atleta.email,
        }))
        setOptions(formattedOptions)
      } catch (error) {
        console.error('Erro ao carregar atletas:', error)
        setOptions([])
      }
    }

    loadAtletas()
  }, [])

  const currencyMask = (value: string | number) => {
    const cleanValue = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString()
    const numberValue = Number(cleanValue) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numberValue)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          _id: initialData._id,
          email: initialData.email,
        }
      : {
          _id: undefined,
          email: '',
          nome: '',
          data_pagamento: new Date(),
          valor: 0,
          mes_referencia: getMesAtual(),
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      console.log(initialData)
      console.log(values)

      if (initialData) {
        console.log(`edita`)
      } else {
        console.log(`adiciona`)
        if (session?.user?.id) {
          await create({
            tipo: 'avulsa',
            email: values.email,
            customer: '',
            id_payment_stripe: 'manual',
            valor: values.valor / 100, // Convert from cents to actual currency
            data_pagamento: values.data_pagamento.getTime(),
            data_cancelamento: 0,
            cancelado: false,
            mes_referencia: values.mes_referencia,
          })

          await createTransacao({
            tipo: 'receita',
            descricao: 'mensalidade de ' + values.nome,
            valor: values.valor / 100,
            data: values.data_pagamento.getTime(),
            categoria: 'mensalidade',
            status: 'confirmado',
            created_at: Date.now(),
            updated_at: Date.now(),
            userId: session.user.id as Id<'user'>,
            comprovante_url: '',
            comprovante_key: '',
            observacao: '',
          })

          form.reset()
          router.back()
          setLoading(false)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Erro', {
        description: 'Ocorreu um erro ao salvar os dados.',
        duration: 3000,
        richColors: true,
      })
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-230px)]  w-full px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="_id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Atletas ativos</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(' justify-between', !field.value && 'text-muted-foreground')}
                      >
                        {field.value
                          ? options.find((option) => option.value === field.value)?.label
                          : 'Selecione o atleta'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput placeholder="Procurar..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>Email não encontrado.</CommandEmpty>
                        <CommandGroup>
                          {options.map((option) => (
                            <CommandItem
                              value={option.label}
                              key={option.value}
                              onSelect={() => {
                                form.setValue('email', option.value)
                                form.setValue('nome', option.label)
                                setOpen(false)
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  option.value === field.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      field.onChange(Number(value))
                    }}
                    value={field.value ? currencyMask(field.value) : ''}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center justify-start gap-4">
            <FormField
              control={form.control}
              name="data_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Pagamento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mes_referencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mês de Referência</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {MESES.map((mes) => (
                        <SelectItem key={mes} value={mes}>
                          {mes}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Mensalidade'}
          </Button>
        </form>
      </Form>
    </ScrollArea>
    /*  </div> */
  )
}
