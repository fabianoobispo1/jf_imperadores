'use client'
import { useQuery } from 'convex/react'
import {
  UsersIcon,
  UserCheckIcon,
  /*   UserPlusIcon, */
  CalendarCheck2,
  QrCodeIcon,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { api } from '../../convex/_generated/api'
import { ScrollArea } from './ui/scroll-area'

export default function DadosIniciais() {
  const { data: session } = useSession()
  const router = useRouter()
  const totalAtletas = useQuery(api.atletas.getCount)
  const totalAtletasAtivos = useQuery(api.atletas.getCountByStatus, {
    status: 1,
  })
  /*   const totalSeletiva = useQuery(api.seletiva.getCount) */
  // const totalAprovados = useQuery(api.seletiva.getCountByAprovados)
  const ultimasPresencas = useQuery(api.presenca.getUltimasPresencas)

  // Agrupa presenças por data e conta total de presentes
  const presencasPorData = ultimasPresencas?.reduce(
    (acc, presenca) => {
      const data = presenca.data_treino
      if (!acc[data]) {
        acc[data] = 0
      }
      if (presenca.presente) {
        acc[data]++
      }
      return acc
    },
    {} as Record<number, number>
  )

  /*   const handleSeletivaClick = () => {
    if (session?.user?.role === 'admin') {
      router.push('/dashboard/seletiva')
    }
  } */
  const handleAtletaClick = () => {
    router.push('/dashboard/atletas')
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-full overflow-x-auto ">
      <div className="grid gap-4 md:grid-cols-3 pb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pix para mensalidade do mês</CardTitle>
            <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>cnpj: 27.871.530/0001-61</p>
            <Image
              className="bg-white rounded-lg"
              src="/qr-code.png"
              alt="QR Code para pagamento"
              width={200}
              height={200}
            />
            <span className="text-sm text-muted-foreground">
              Ao realizar o pagamento envie o comprovante para o MH no whatsapp
            </span>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atletas</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAtletas === undefined ? <Skeleton className="h-8 w-20" /> : totalAtletas || 0}
            </div>
          </CardContent>
        </Card>

        <Card
          className={session?.user?.role === 'admin' ? 'cursor-pointer hover:bg-gray-100' : ''}
          onClick={handleAtletaClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atletas Ativos{/*  + Aprovados */}
            </CardTitle>
            <UserCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAtletasAtivos === undefined ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                totalAtletasAtivos || 0
              )}
              {/*  {' + '} */}
              {/*  {totalAprovados === undefined ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                totalAprovados || 0
              )} */}
            </div>
            {/*  {' Total '} */}
            {/*    {totalAtletasAtivos === undefined ||
            totalAprovados === undefined ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              (totalAtletasAtivos || 0) + (totalAprovados || 0)
            )} */}
          </CardContent>
        </Card>
        {/* 
        <Card
          className={
            session?.user?.role === 'admin'
              ? 'cursor-pointer hover:bg-gray-100'
              : ''
          }
          onClick={handleSeletivaClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inscrições para a Seletiva
            </CardTitle>
            <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSeletiva === undefined ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                totalSeletiva || 0
              )}
            </div>
          </CardContent>
        </Card> */}

        <Card className="cursor-pointer hover:bg-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos Treinos</CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {presencasPorData === undefined ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                Object.entries(presencasPorData)
                  .sort(([dataA], [dataB]) => Number(dataB) - Number(dataA))
                  .slice(0, 3)
                  .map(([data, total]) => (
                    <div key={data} className="flex justify-between text-sm">
                      <span>{format(Number(data), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      <span>{total} atletas</span>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
