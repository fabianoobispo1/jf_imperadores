'use client'
import { useQuery } from 'convex/react'
import { BarChart, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

export function DashboardFinanceiro() {
  const balancoMensal = useQuery(api.financas.getBalancoMensal, {})

  const transacoesPorCategoria = useQuery(api.financas.getTransacoesPorCategoria, {})

  const historicoMensal = useQuery(api.financas.getHistoricoMensal, {})

  const saldoTotal = (balancoMensal?.receitas || 0) - (balancoMensal?.despesas || 0)

  return (
    <div className="space-y-8 mr-4 relative">
      {/* Cards principais */}
      <div className="grid gap-4 md:grid-cols-4 ">
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(saldoTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(balancoMensal?.receitas || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(balancoMensal?.despesas || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transacoesPorCategoria?.total || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line
              options={options}
              data={{
                labels:
                  historicoMensal?.map((h) => format(new Date(h.mes), 'MMM', { locale: ptBR })) ||
                  [],
                datasets: [
                  {
                    label: 'Receitas',
                    data: historicoMensal?.map((h) => h.receitas) || [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    tension: 0.4,
                  },
                  {
                    label: 'Despesas',
                    data: historicoMensal?.map((h) => h.despesas) || [],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    tension: 0.4,
                  },
                ],
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              options={options}
              data={{
                labels: transacoesPorCategoria?.categorias.map((c) => c.nome) || [],
                datasets: [
                  {
                    label: 'Total de Transações por Categoria',
                    data: transacoesPorCategoria?.categorias.map((c) => c.total) || [],
                    backgroundColor: [
                      'rgba(53, 162, 235, 0.8)',
                      'rgba(75, 192, 192, 0.8)',
                      'rgba(255, 205, 86, 0.8)',
                      'rgba(255, 99, 132, 0.8)',
                      'rgba(54, 162, 235, 0.8)',
                    ],
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
