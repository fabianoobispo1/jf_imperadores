import { ScrollArea } from '@/components/ui/scroll-area'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'

import { FinanceiroTabs } from './components/financeiro-tabs'

const breadcrumbItems = [{ title: 'Financeiro', link: '/dashboard/financeiro' }]
export default function page() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading
            title={'Gestão Financeira'}
            description={'Controle todas as movimentações financeiras do time'}
          />
        </div>
        <FinanceiroTabs />
      </div>
    </ScrollArea>
  )
}
