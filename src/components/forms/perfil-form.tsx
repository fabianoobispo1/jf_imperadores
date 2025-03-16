'use client'
import * as z from 'zod'
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { useSession } from 'next-auth/react'
import { compare, hash } from 'bcryptjs'

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

import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { ImageUpload } from '@/app/(dashboard)/dashboard/perfil/image-upload'
import { DatePickerSimple } from '../date-picker-simple'

const formSchema = z
  .object({
    id: z.string(),
    nome: z.string().min(3, { message: 'Nome precisa ser preenchido.' }),
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

    image: z
      .object({
        url: z.string().optional(),
        key: z.string().optional(),
      })
      .nullable()
      .optional(),
    email: z.string().email({ message: 'Digite um email valido.' }),
    provider: z.string().optional(),

    oldPassword: z.union([
      // Opção 1: string vazia é válida
      z.literal(''),
      // Opção 2: string com pelo menos 8 caracteres
      z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    ]),
    password: z.union([
      // Opção 1: string vazia é válida
      z.literal(''),
      // Opção 2: string com pelo menos 8 caracteres
      z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    ]),
    confirmPassword: z.string().optional(),
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
  .refine((data) => !data.oldPassword || (data.oldPassword && data.password), {
    message: 'Informe a nova senha.',
    path: ['password'], // Aponta para o campo `password`
  })
  .refine((data) => !data.password || (data.password && data.confirmPassword), {
    message: 'O campo de confirmação de senha é obrigatório quando a senha é preenchida.',
    path: ['confirmPassword'], // Aponta para o campo `confirmPassword`
  })
  .refine(
    (data) => !data.password || !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: 'As senhas não coincidem.',
      path: ['confirmPassword'], // Aponta para o campo `confirmPassword`
    }
  )

type ProductFormValues = z.infer<typeof formSchema>

export const PerfilForm: React.FC = () => {
  const { data: session } = useSession()
  const [loadingData, setLoadingData] = useState(true)
  const [bloqueioProvider, setBloqueioProvider] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [passwordHash, setPasswordHash] = useState('1')
  const [emailAtual, setEmailAtual] = useState('')
  const [carregou, setiscarregou] = useState(false)

  const defaultValues = {
    id: '',
    nome: '',
    data_nascimento: undefined,
    email: '',
    image: null,
    oldPassword: '',
    password: '',
    confirmPassword: '',
    provider: '',
  }
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const loadUser = useCallback(async () => {
    setLoadingData(true)

    if (session) {
      try {
        const response = await fetchQuery(api.user.getById, {
          userId: session.user.id as Id<'user'>,
        })
        if (!response) {
          console.error('Erro ao buscar os dados do usuário:')
          return
        }

        if (response.provider !== 'credentials') {
          setBloqueioProvider(true)
        }
        // Atualiza os valores do formulário com os dados da API
        setPasswordHash(response.password)
        setEmailAtual(response.email)
        console.log('Inicio')
        console.log(response)
        form.reset({
          id: response._id,
          nome: response.nome,
          email: response.email,
          data_nascimento: response.data_nascimento
            ? new Date(response.data_nascimento).getTime()
            : undefined,
          image: response.image
            ? {
                url: response.image,
                key: response.image_key,
              }
            : null,
          oldPassword: '',
          password: '',
          confirmPassword: '',
          provider: response.provider,
        })
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error)
      } finally {
        setLoadingData(false) // Define o carregamento como concluído
      }
    }
  }, [sessionId, session, form])
  useEffect(() => {
    if (session) {
      if (!carregou) {
        setSessionId(session.user.id)
        loadUser()
        setiscarregou(true)
      }
    }
  }, [setSessionId, session, setiscarregou, carregou, loadUser])

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true)

    let password = ''
    if (data.oldPassword) {
      const isMatch = await compare(data.oldPassword, passwordHash)

      if (!isMatch) {
        toast.error('Erro', {
          description: 'Senha antiga incorreta.',
          duration: 3000,
          richColors: true,
        })
        setLoading(false)
        return
      }
      const newPassword = data.password
      if (newPassword) {
        password = await hash(newPassword, 6)
      }
    }
    // verifica email
    if (emailAtual !== data.email) {
      // se for alterado, precisa verificar se ja exsite o cadastro
      const emailExists = await fetchQuery(api.user.getByEmail, {
        email: data.email,
      })

      if (emailExists) {
        toast.error('Erro', {
          description: 'Email já cadastrado.',
          duration: 3000,
          richColors: true,
        })
        setLoading(false)
        return
      }
    }

    await fetchMutation(api.user.UpdateUser, {
      userId: data.id as Id<'user'>,
      email: data.email,
      nome: data.nome,
      data_nascimento: data.data_nascimento,
      provider: data.provider,
      image: data.image?.url,
      image_key: data.image?.key,
      password,
    })

    toast.success('Ok', {
      description: 'Cadastro alterado.',
      duration: 3000,
      richColors: true,
    })
    // Recarrega os dados do usuário para atualizar a interface
    await loadUser()

    form.reset({
      ...form.getValues(),
      oldPassword: '',
      password: '',
      confirmPassword: '',
    })
    setLoading(false)
  }

  // Adicione esta função ao componente PerfilForm
  const handleImageChange = async (imageData: { url: string; key: string } | null) => {
    if (!form.getValues('id')) return

    if (imageData) {
      await fetchMutation(api.user.UpdateUserImg, {
        userId: form.getValues('id') as Id<'user'>,
        image: imageData.url,
        image_key: imageData.key,
      })
    } else {
      await fetchMutation(api.user.UpdateUserImg, {
        userId: form.getValues('id') as Id<'user'>,
        image: '',
        image_key: '',
      })
    }
  }

  if (loadingData) {
    return <Spinner />
  }

  return (
    <ScrollArea className="h-[70vh] w-full px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
          autoComplete="off"
        >
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormControl>
                    <ImageUpload
                      value={
                        field.value
                          ? {
                              url: field.value.url || '',
                              key: field.value.key || '',
                            }
                          : null
                      }
                      onChange={(imageData) => {
                        // Primeiro atualiza o campo no formulário
                        field.onChange(imageData)
                        // Depois envia para o servidor
                        handleImageChange(imageData)
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className=" flex-col hidden">
                  <FormLabel>id</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading || bloqueioProvider} placeholder="Email" {...field} />
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

            {bloqueioProvider ? (
              <></>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col px-1">
                      <FormLabel>Senha antiga</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder=""
                          disabled={loading || bloqueioProvider}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col px-1">
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder=""
                          disabled={loading || bloqueioProvider}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col px-1">
                      <FormLabel>Comfirmar nova senha</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder=""
                          disabled={loading || bloqueioProvider}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            Salvar
          </Button>
        </form>
      </Form>
    </ScrollArea>
  )
}
