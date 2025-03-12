'use client'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import Image from 'next/image'
import { toast } from 'sonner'

import UserAuthForm from '@/components/forms/user-auth-form'
import UserRegisterForm from '@/components/forms/user-register-form'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { api } from '../../../convex/_generated/api'

const formSchema = z.object({
  email: z.string().email({ message: 'Digite um email valido.' }),
})

export default function AuthenticationModal() {
  const [button, setButton] = useState('Cadastrar')
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // verifica email
    const emailExists = await fetchQuery(api.user.getByEmail, {
      email: data.email,
    })

    if (emailExists) {
      // verifica se logou com algum provider
      if (emailExists.provider !== 'credentials') {
        toast.error('Erro', {
          description: 'Sem senha para resetar',
          duration: 3000,
          richColors: true,
        })
        setOpen(false)
        return
      }
      const timestampAtual = new Date().getTime()
      const trintaMinutosEmMilissegundos = 30 * 60 * 1000 // 30 minutos em milissegundos
      const timestampMais30Min = timestampAtual + trintaMinutosEmMilissegundos

      const recuperaSenha = await fetchMutation(api.recuperaSenha.create, {
        email: data.email,
        created_at: timestampAtual,
        valid_at: timestampMais30Min,
      })

      fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          nome: emailExists.nome,
          idRecuperaSenha: recuperaSenha,
          tipoMensagem: 'redefinirSenha',
        }),
      })
        .then(async (res) => {
          console.log(res)
        })
        .catch(() => {})
        .finally(() => {})
    }
    setOpen(false)
  }
  return (
    <>
      <button
        onClick={() => {
          button === 'Cadastrar' ? setButton('Login') : setButton('Cadastrar')
        }}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        {button}
      </button>

      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col justify-center items-center space-y-2 text-center">
            {/*   <h1 className="text-3xl font-bold tracking-tight pb-8">
              JF imperadores
            </h1> */}
            {/* <Image src={'/logo.png'} alt="logo" width={250} height={250} /> */}
            <h1 className="text-2xl font-semibold tracking-tight">
              {button === 'Login' ? 'Criar uma conta' : 'Realizar login'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {button === 'Login'
                ? 'Digite seu e-mail abaixo para criar sua conta.'
                : 'Digite seu e-mail abaixo para realizar login.'}
            </p>
          </div>
          {button === 'Login' ? <UserRegisterForm setButton={setButton} /> : <UserAuthForm />}
          <p className="px-8 text-center text-sm text-muted-foreground">
            Esqueceu sua Senha? recupere{' '}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="  text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
                aqui.
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription>
                    <div className="flex justify-center pb-4">
                      <p>Insira seu email para receber um link para redfinir sua senha.</p>
                    </div>
                    {/*       <div className="flex w-full items-center space-x-2">
                      <Input type="email" placeholder="Email" />
                      <Button type="submit">Enviar</Button>
                    </div> */}

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex justify-center gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit">Enviar</Button>
                      </form>
                    </Form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </div>
    </>
  )
}
