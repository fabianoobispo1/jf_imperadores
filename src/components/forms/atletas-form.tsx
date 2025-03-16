'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useMutation } from 'convex/react'
import { fetchQuery } from 'convex/nextjs'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCPF, formatPhone } from '@/lib/utils'
import { toast } from 'sonner'
import type { Id } from '../../../convex/_generated/dataModel'
import { api } from '../../../convex/_generated/api'
import { DatePickerSimple } from '../date-picker-simple'

const formSchema = z
  .object({
    status: z.string(),
    nome: z.string().min(2, { message: 'Nome é obrigatório' }),
    cpf: z.string().min(11, { message: 'CPF inválido' }),
    email: z.string().email({ message: 'Email inválido' }),
    data_nascimento: z.preprocess(
      (val) => {
        // Transforma null em undefined
        if (val === null) return undefined
        // Se já for um número (timestamp), mantém como está
        if (typeof val === 'number') return val
        return undefined
      },
      z
        .number({
          required_error: 'A data de nascimento precisa ser preenchida.',
        })
        .optional()
    ),
    altura: z.string(),
    peso: z.string(),
    celular: z.string(),
    setor: z.string(),
    posicao: z.string(),
    rua: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    cep: z.string(),
    uf: z.string(),
    complemento: z.string(),
    genero: z.string(),
    rg: z.string(),
    emisor: z.string(),
    uf_emisor: z.string(),
  })
  .refine(
    (data) => {
      if (!data.data_nascimento) return true
      return data.data_nascimento <= Date.now()
    },
    {
      message: 'A data de nascimento não pode ser uma data futura.',
      path: ['data_nascimento'],
    }
  )

interface AtletasFormProps {
  initialData?: {
    _id: Id<'atletas'>
    _creationTime: number
    status: number
    nome: string
    cpf: string
    data_nascimento?: number | undefined
    data_registro?: number | undefined
    email: string
    altura?: number
    peso?: number
    celular: string
    setor: number
    posicao: string
    rua: string
    bairro: string
    cidade: string
    cep: string
    uf: string
    complemento: string
    genero: string
    rg: string
    emisor: string
    uf_emisor: string
    img_link: string
  } | null
  onSuccess?: () => void
}

export const AtletasForm: React.FC<AtletasFormProps> = ({ initialData, onSuccess }) => {
  const update = useMutation(api.atletas.update)
  const create = useMutation(api.atletas.create)

  const [loading, setLoading] = useState(false)

  /*   const { open } = useSidebar() */

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          status: String(initialData.status),
          nome: initialData.nome,
          cpf: initialData.cpf,
          email: initialData.email,
          data_nascimento: initialData.data_nascimento
            ? new Date(initialData.data_nascimento).getTime()
            : undefined,
          altura: initialData.altura ? String(initialData.altura) : '',
          peso: initialData.peso ? String(initialData.peso) : '',
          celular: initialData.celular,
          setor: String(initialData.setor),
          posicao: initialData.posicao,
          rua: initialData.rua,
          bairro: initialData.bairro,
          cidade: initialData.cidade,
          cep: initialData.cep,
          uf: initialData.uf,
          complemento: initialData.complemento,
          genero: initialData.genero,
          rg: initialData.rg,
          emisor: initialData.emisor,
          uf_emisor: initialData.uf_emisor,
        }
      : {
          status: '',
          nome: '',
          cpf: '',
          email: '',
          data_nascimento: undefined,
          altura: '',
          peso: '',
          celular: '',
          setor: '',
          posicao: '',
          rua: '',
          bairro: '',
          cidade: '',
          cep: '',
          uf: '',
          complemento: '',
          genero: '',
          rg: '',
          emisor: '',
          uf_emisor: '',
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      console.log(initialData)
      console.log(values)

      if (initialData) {
        // Check if email already exists
        const existingAtleta = await fetchQuery(api.atletas.getByEmail, {
          email: values.email,
        })

        if (existingAtleta) {
          toast.error('Erro', {
            description: 'Email já cadastrado no sistema.',
            duration: 3000,
            richColors: true,
          })
        } else {
          await update({
            atletaId: initialData._id,
            status: parseInt(values.status),
            nome: values.nome,
            cpf: values.cpf,
            email: values.email,
            data_nascimento: values.data_nascimento,
            data_registro: initialData.data_registro,
            altura: parseFloat(values.altura),
            peso: parseFloat(values.peso),
            celular: values.celular,
            setor: parseInt(values.setor),
            posicao: values.posicao,
            rua: values.rua,
            bairro: values.bairro,
            cidade: values.cidade,
            cep: values.cep,
            uf: values.uf,
            complemento: values.complemento,
            genero: values.genero,
            rg: values.rg,
            emisor: values.emisor,
            uf_emisor: values.uf_emisor,
            img_link: '',
          })

          toast.success('Atleta Altrerado com sucesso!', {
            description: 'Os dados foram alterados no sistema.',
            duration: 3000,
            richColors: true,
          })

          form.reset()

          onSuccess?.()
          setLoading(false)
        }
      } else {
        console.log(`adiciona`)

        // Check if email already exists
        const existingAtleta = await fetchQuery(api.atletas.getByEmail, {
          email: values.email,
        })

        if (existingAtleta) {
          toast.error('Erro', {
            description: 'Email já cadastrado no sistema.',
            duration: 3000,
            richColors: true,
          })
        } else {
          await create({
            status: parseInt(values.status),
            nome: values.nome,
            cpf: values.cpf,
            email: values.email,
            data_nascimento: values.data_nascimento,
            data_registro: new Date().getTime(),
            altura: values.altura ? parseFloat(values.altura) : 0,
            peso: values.peso ? parseFloat(values.peso) : 0,
            celular: values.celular,
            setor: parseInt(values.setor),
            posicao: values.posicao,
            rua: values.rua,
            bairro: values.bairro,
            cidade: values.cidade,
            cep: values.cep,
            uf: values.uf,
            complemento: values.complemento,
            genero: values.genero,
            rg: values.rg,
            emisor: values.emisor,
            uf_emisor: values.uf_emisor,
            img_link: '',
          })

          toast.success('Atleta cadastrado com sucesso!', {
            description: 'Os dados foram salvos no sistema.',
            duration: 3000,
            richColors: true,
          })

          form.reset()

          onSuccess?.()
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
    /*    <div
      className={cn(
        'space-y-8 w-screen pr-4 ',
        open ? 'md:max-w-[calc(100%-18rem)] ' : 'md:max-w-[calc(100%-7rem)] ',
      )}
    > */
    <ScrollArea className="h-[calc(100vh-270px)]  w-full px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Ativo</SelectItem>
                    <SelectItem value="2">Inativo</SelectItem>
                    <SelectItem value="3">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do atleta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="000.000.000-00"
                    value={formatCPF(field.value)}
                    onChange={(e) => field.onChange(formatCPF(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_nascimento"
            render={({ field }) => (
              <FormItem className="flex flex-col px-1">
                <FormLabel>Data Nascimento</FormLabel>
                <FormControl>
                  <DatePickerSimple
                    timestamp={field.value} // Já é um timestamp (number)
                    setTimestamp={(newTimestamp) => {
                      // Atualiza diretamente o campo com o timestamp
                      field.onChange(newTimestamp)
                    }}
                    placeholder="Selecione a data de nascimento"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="celular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formatPhone(field.value)}
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="altura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (m)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="1.80" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="peso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="80" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="setor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Ataque</SelectItem>
                    <SelectItem value="2">Defesa</SelectItem>
                    <SelectItem value="3">Special Teams</SelectItem>
                    <SelectItem value="4">Sem preferência</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="posicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição</FormLabel>
                <FormControl>
                  <Input placeholder="Posição" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rua"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input placeholder="Rua" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input placeholder="UF" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Complemento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl>
                  <Input placeholder="RG" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Órgão Emissor</FormLabel>
                <FormControl>
                  <Input placeholder="Órgão Emissor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uf_emisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF Emissor</FormLabel>
                <FormControl>
                  <Input placeholder="UF" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Atleta'}
          </Button>
        </form>
      </Form>
    </ScrollArea>
    /*  </div> */
  )
}
