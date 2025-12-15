import { auth } from '@/auth/auth'
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heading } from '@/components/ui/heading'
import BreadCrumb from '@/components/breadcrumb'
import { VendacamisaForm } from '@/components/forms/vendacamisa-form'
import { VendacamisaList } from '@/components/vendacamisa-list'
import { Card } from '@/components/ui/card'

const breadcrumbItems = [{ title: 'Venda Camisa', link: '/dashboard/venda-camisa' }]

export default async function Page() {
  const session = await auth()

  if (!session?.user) redirect('/')

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between gap-4">
          <Heading
            title={'Venda de Camisas'}
            description={'Gerencie as vendas de camisas do time'}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulário para criar nova venda */}
          <Card className="p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Nova Venda</h3>
            <VendacamisaForm />
          </Card>

          {/* Lista de vendas */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Vendas Registradas</h3>
              <VendacamisaList />
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
