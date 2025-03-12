'use client'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { hash } from 'bcryptjs'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

const formSchema = z
  .object({
    id: z.string(),
    password: z.string().min(8, { message: 'Senha obrigatoria, min 8' }),
    confirmPassword: z.string().min(8, { message: 'Senha obrigatoria, min 8' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coecindem',
    path: ['confirmPassword'],
  })
type ProductFormValues = z.infer<typeof formSchema>

interface ResetPasswordFormProps {
  idResetSenha: string
}

export default function ResetPasswordForm({ idResetSenha }: ResetPasswordFormProps) {
  const router = useRouter()
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [carregou, setiscarregou] = useState(false)
  const [idInvalido, setIdInvalido] = useState(false)
  const [idVencido, setIdVencido] = useState(false)
  const [nome, setNome] = useState('')

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
  })

  const loadUser = useCallback(async () => {
    setLoadingData(true)

    try {
      const response = await fetchQuery(api.recuperaSenha.getById, {
        _id: idResetSenha as Id<'recuperaSenha'>,
      })

      if (!response) {
        return
      }
      // verifica campo valid_at
      // Obter a data atual como timestamp

      if (response.valid_at < Date.now()) {
        setIdVencido(true)
      }

      // recupera ID do usuario
      const responseUsuario = await fetchQuery(api.user.getByEmail, {
        email: response.email,
      })
      if (!responseUsuario) {
        return
      }

      setNome(responseUsuario.nome)

      form.reset({
        id: responseUsuario._id,
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      setIdInvalido(true)
      console.log('Erro ao buscar os dados do usuário: ' + error)
    } finally {
      setLoadingData(false)
    }
  }, [idResetSenha, form])

  useEffect(() => {
    if (idResetSenha) {
      if (!carregou) {
        loadUser()
        setiscarregou(true)
      }
    }
  }, [idResetSenha, setiscarregou, carregou, loadUser])

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true)
    console.log(data)

    let password = ''
    const newPassword = data.password
    if (newPassword) {
      password = await hash(newPassword, 6)
    }
    console.log(password)
    await fetchMutation(api.user.UpdateUserLoginPassword, {
      userId: data.id as Id<'user'>,
      password,
    })

    // altera o campo valid_at par ao link nao ser mais valido

    await fetchMutation(api.recuperaSenha.invalidaRecuperarSenha, {
      _id: idResetSenha as Id<'recuperaSenha'>,
    })

    toast.success('ok', {
      description: 'Cadastro alterado.',
      duration: 3000,
      richColors: true,
    })

    router.push('/entrar')
    setLoading(true)
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    )
  }
  if (idInvalido) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Card className="w-[350px] bg-white">
          <CardHeader>
            <CardTitle>Link Invalido</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }
  if (idVencido) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Card className="w-[350px] bg-white">
          <CardHeader>
            <CardTitle>Link Vencido</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Card className="w-[350px] bg-white">
        <CardHeader>
          <CardTitle>Redefinir senha</CardTitle>
          <CardDescription>DIgite sua nova senha {nome}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
              autoComplete="off"
            >
              <div className="flex flex-col ">
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder=""
                          disabled={loading}
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
                    <FormItem>
                      <FormLabel>Comfirmar nova senha</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder=""
                          disabled={loading}
                          {...field}
                        />
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
        </CardContent>
      </Card>
    </div>
  )
}
