'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { fetchQuery } from 'convex/nextjs'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/ui/sidebar'

import { api } from '../../../../../convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

interface Product {
  id: string
  imageUrl: string
  nome: string
  preco: number
  default_price: string
}
interface Mensalidade {
  _id: Id<'mensalidade'>
  _creationTime: number
  email: string
  tipo: 'avulsa' | 'recorrente'
  valor: number
  customer: string
  id_payment_stripe: string
  data_pagamento: number
  mes_referencia: string
  data_cancelamento: number
  cancelado: boolean
}

export const Produtos = () => {
  const { open } = useSidebar()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  const [isAtleta, setIsAtleta] = useState(false)
  const [hasPaidThisMonth, setHasPaidThisMonth] = useState(false)
  const [tipoMensalidade, setTipoMensalidade] = useState('')
  const [mensalidadesPagas, setMensalidadesPagas] = useState<Mensalidade[]>([])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stripe/listProducts', {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY_SECRET,
        },
      })
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkAtleta = async () => {
      setLoading(true)
      if (session?.user?.email) {
        const atleta = await fetchQuery(api.atletas.getByEmail, {
          email: session.user.email,
        })

        if (!atleta) {
          toast.warning('Acesso Negado', {
            description: 'Você precisa ser um atleta cadastrado para acessar esta área',
            duration: 3000,
            richColors: true,
          })
          setIsAtleta(false)
          setLoading(false)
          return
        }

        const currentDate = new Date()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const mensalidade = await fetchQuery(api.mensalidade.getByEmailAndDateRange, {
          email: session.user.email,
          startDate: firstDayOfMonth.getTime(),
          endDate: lastDayOfMonth.getTime(),
        })

        setHasPaidThisMonth(!!mensalidade)
        setTipoMensalidade(mensalidade?.tipo || '')

        // Buscar todas as mensalidades pagas pelo atleta
        const todasMensalidades = await fetchQuery(api.mensalidade.getAllByEmail, {
          email: session.user.email,
        })

        setMensalidadesPagas(todasMensalidades || [])

        setIsAtleta(true)
        fetchProducts()
        setLoading(false)
      }
    }

    checkAtleta()
  }, [session, toast])

  const handleSelectProduct = async (productId: string, default_price: string, nome: string) => {
    try {
      setLoading(true)
      const mode = nome.toLowerCase().includes('avulsa') ? 'payment' : 'subscription'

      const response = await axios.post(
        '/api/stripe/checkout',
        {
          productId,
          default_price,
          userEmail: session?.user?.email,
          mode,
        },
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY_SECRET,
          },
        }
      )

      // Redirect to Stripe checkout
      window.location.href = response.data.url
    } catch (error) {
      console.log(error)
      toast.error('Erro', {
        description: 'Não foi possível processar o pagamento',
        duration: 3000,
        richColors: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollArea
      className={cn(
        'space-y-8 w-full pr-8 md:pr-1  h-[calc(100vh-220px)] ',
        open ? 'md:max-w-[calc(100%-16rem)] ' : 'md:max-w-[calc(100%-5rem)] '
      )}
    >
      <div className="space-y-6">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {isAtleta && mensalidadesPagas.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Mensalidades Pagas</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Pagamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês de Referência
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mensalidadesPagas.map((mensalidade: any) => (
                        <tr key={mensalidade._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {mensalidade.tipo === 'avulsa' ? 'Avulsa' : 'Recorrente'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(mensalidade.valor)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(mensalidade.data_pagamento).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {mensalidade.mes_referencia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {mensalidade.cancelado ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Cancelado
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Ativo
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}{' '}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {isAtleta ? (
              <>
                {hasPaidThisMonth && (
                  <div className="col-span-full mb-4 p-4 bg-green-100 rounded-lg text-green-800">
                    {tipoMensalidade === 'avulsa'
                      ? 'Sua mensalidade deste mês já está paga!'
                      : 'Você já possui uma mensalidade recorrente ativa! Seu próximo pagamento será processado automaticamente.'}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-sm">
                      <Image
                        src={product.imageUrl}
                        alt={product.nome || 'Produto'}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <h3 className="text-lg font-semibold mt-2">{product.nome}</h3>
                      <p className="text-gray-600">R$ {(product.preco / 100).toFixed(2)}</p>
                      <Button
                        className="w-full mt-4"
                        onClick={() =>
                          handleSelectProduct(product.id, product.default_price, product.nome)
                        }
                        disabled={hasPaidThisMonth}
                      >
                        Selecionar
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <p>
                  você não esta cadastrado como atleta ou seu email de cadastro não e o mesmo da
                  lista de atletas.
                </p>
                <p> verifique com um administrador sua situação.</p>
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  )
}
