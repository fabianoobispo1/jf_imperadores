'use client'
import * as z from 'zod'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { formatCPF, formatHeight, formatPhone, formatWeight } from '@/lib/utils'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { api } from '../../../convex/_generated/api'

// Definir as opções de setor com seus respectivos valores numéricos
const SETOR_OPTIONS = [
  {
    value: 1,
    label: 'Ataque (OL - TE - WR - HB - QB)',
  },
  {
    value: 2,
    label: 'Defesa (DL - LB - DB)',
  },
  {
    value: 3,
    label: 'Special Teams (K / P)',
  },
  {
    value: 4,
    label: 'Não possuo preferência de setor',
  },
] as const

// Definir as opções de equipamentos com seus respectivos valores numéricos
const EQUIPAMENTO_OPTIONS = [
  {
    value: 1,
    label: 'Sim os dois equipamentos',
  },
  {
    value: 2,
    label: 'Somente a ombreira',
  },
  {
    value: 3,
    label: 'Somente capacete',
  },
  {
    value: 4,
    label: 'Não possuo nenhum equipamento',
  },
] as const

// Definir as opções de posição com seus respectivos valores numéricos
const POSICAO_OPTIONS = [
  { value: 1, label: 'OL' },
  { value: 2, label: 'TE' },
  { value: 3, label: 'WR' },
  { value: 4, label: 'RB' },
  { value: 5, label: 'QB' },
  { value: 6, label: 'DL' },
  { value: 7, label: 'LB' },
  { value: 8, label: 'DB' },
  { value: 9, label: 'K / P' },
  { value: 10, label: 'Não possuo experiência' },
] as const

const formSchema = z
  .object({
    nome: z.string().min(3, { message: 'Nome precisa ser preenchido.' }),
    data_nascimento: z.preprocess(
      (val) => (val === null ? undefined : val), // Transforma null em undefined
      z.date({
        required_error: 'A data de nascimento precisa ser preenchida.',
      })
    ),

    email: z.string().email({ message: 'Digite um email valido.' }),

    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
      message: 'CPF inválido.',
    }),
    celular: z.string().regex(/^\(\d{2}\)\d{5}-\d{4}$/, {
      message: 'Celular inválido.',
    }),
    altura: z.string().regex(/^\d{1,1}\.\d{2}$/, {
      message: 'Altura inválida. Use o formato 0.00',
    }),
    peso: z.string().regex(/^\d{2,3}\.\d{1}$/, {
      message: 'Peso inválido. Use o formato 00.0',
    }),
    tem_experiencia: z.boolean().default(false),
    equipe_anterior: z.string(),
    setor: z.number({
      required_error: 'Selecione um setor',
    }),
    posicao: z.array(z.number()).min(1, {
      message: 'Selecione pelo menos uma posição',
    }),

    equipamento: z.number({
      required_error: 'Selecione uma opção',
    }),
  })
  .refine(
    (data) => {
      if (data.tem_experiencia) {
        return data.equipe_anterior.length > 0
      }
      return true
    },
    {
      message: 'Equipe anterior precisa ser preenchida quando possui experiência.',
      path: ['equipe_anterior'], // Isso faz a mensagem aparecer no campo correto
    }
  )

type ProductFormValues = z.infer<typeof formSchema>

export const SeletivaForm: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const defaultValues = {
    /*     nome: 'Fabiano bispo',
    data_nascimento: new Date(),
    email: 'fbc623@gmail.com',
    cpf: '094.600.666-07',
    celular: '(32)99167-8449',
    altura: '1.90',
    peso: '160.3',
    tem_experiencia: true,
    equipe_anterior: 'time x',
    setor: 1, // começa sem seleção
    equipamento: 1, // começa sem seleção
    posicao: [1], */
    nome: '',
    data_nascimento: undefined,
    email: '',
    cpf: '',
    celular: '',
    altura: '',
    peso: '',
    tem_experiencia: false,
    equipe_anterior: '',
    setor: undefined, // começa sem seleção
    equipamento: undefined, // começa sem seleção
    posicao: [],
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const posicaoArrayToString = (posicoes: number[]) => {
    return posicoes
      .map((posicaoId) => POSICAO_OPTIONS.find((opt) => opt.value === posicaoId)?.label)
      .filter(Boolean) // Remove undefined values
      .join(', ') // Junta com vírgula e espaço
  }

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true)
    // vrfica e ja exsite registro
    const existCandidatoByemail = await fetchQuery(api.seletiva.getByEmail, {
      email: data.email,
    })
    if (existCandidatoByemail) {
      form.reset()
      toast.error('Erro', {
        description: 'Email já cadastrado.',
        duration: 3000,
        richColors: true,
      })
      setLoading(false)
      return
    }

    const cpfSemMascara = data.cpf.replace(/\D/g, '')
    const celularSemMascara = data.celular.replace(/\D/g, '')
    const alturaNumerica = parseFloat(data.altura)
    const pesoNumerico = parseFloat(data.peso)

    let imgUrl = ''

    const timestamp = data.data_nascimento ? new Date(data.data_nascimento).getTime() : 0
    const posicaoString = posicaoArrayToString(data.posicao)

    /*   console.log(data.nome)
    console.log(cpfSemMascara)
    console.log(timestamp)
    console.log(data.email)
    console.log(alturaNumerica)
    console.log(pesoNumerico)
    console.log(celularSemMascara)
    console.log(data.tem_experiencia)
    console.log(data.equipe_anterior)
    console.log(data.setor)
    console.log(posicaoString)
    console.log(data.equipamento)
    console.log(imgUrl)
 */

    const candidato = await fetchMutation(api.seletiva.create, {
      numerio_seletiva: 1,
      nome: data.nome,
      cpf: cpfSemMascara,
      data_nascimento: timestamp,
      email: data.email,
      altura: alturaNumerica,
      peso: pesoNumerico,
      celular: celularSemMascara,
      tem_experiencia: data.tem_experiencia,
      equipe_anterior: data.equipe_anterior,
      setor: data.setor,
      posicao: posicaoString,
      equipamento: data.equipamento,
      img_link: imgUrl,
    })

    fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        nome: data.nome,

        tipoMensagem: 'confirmaSeletiva',
      }),
    })
      .then(async (res) => {
        console.log(res)
      })
      .catch(() => {})
      .finally(() => {})

    if (!candidato) {
      toast.error('Erro', {
        description: 'Candidato não cadastrado.',
        duration: 3000,
        richColors: true,
      })
      setLoading(false)
      return
    }

    toast.success('ok', {
      description: 'Candidato cadastrado.',
      duration: 3000,
      richColors: true,
    })
    form.reset()
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nome Complento</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Sua resposta" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Sua resposta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="000.000.000-00"
                    value={field.value}
                    onChange={(e) => field.onChange(formatCPF(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_nascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Nascimento</FormLabel>
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
            name="celular"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Telefone (Celular Whatsapp)</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="(00)00000-0000"
                    value={field.value}
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
              <FormItem className="flex flex-col">
                <FormLabel>Altura (metros)</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="1.85"
                    value={field.value}
                    onChange={(e) => field.onChange(formatHeight(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="peso"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="80.2"
                    value={field.value}
                    onChange={(e) => field.onChange(formatWeight(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tem_experiencia"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Experiência de Futebol Americano? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value?.toString()}
                    className="space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Sim</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Não</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipe_anterior"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Equipe Anterior</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading || !form.watch('tem_experiencia')}
                    placeholder={
                      form.watch('tem_experiencia')
                        ? 'Nome da equipe anterior e quanto tempo?'
                        : 'Sem experiência anterior'
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="setor"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Tem preferência de setor que queira jogar? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    className=""
                  >
                    {SETOR_OPTIONS.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="posicao"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Se possui experiência, em qual posição?</FormLabel>
                <FormControl>
                  <div className="space-y-1">
                    {POSICAO_OPTIONS.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const updatedValues = checked
                                ? [...field.value, option.value]
                                : field.value?.filter((value) => value !== option.value)
                              field.onChange(updatedValues)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipamento"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Possui equipamentos? (Capacete e ombreira)</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    className=""
                  >
                    {EQUIPAMENTO_OPTIONS.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={loading} className="ml-auto" type="submit">
          Salvar
        </Button>
      </form>
    </Form>
  )
}
