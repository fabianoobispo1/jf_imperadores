import BreadCrumb from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VerificaAdmin } from '@/components/VerificaAdmin'

import { Mensalidades } from './mensalidades'

const breadcrumbItems = [
  { title: 'Mensalidades', link: '/dashboard/mensalidades' },
]
export default function Page() {
  return (
    <ScrollArea className="h-full w-full md:w-[calc(100%-5rem)]">
      <div className="w-full space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <Mensalidades />
      </div>
      <VerificaAdmin />
    </ScrollArea>
  )
}
