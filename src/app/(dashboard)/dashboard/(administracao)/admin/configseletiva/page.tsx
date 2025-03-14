import BreadCrumb from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ConfigSeletiva } from './config-seletiva'

const breadcrumbItems = [
  { title: 'Administração', link: '/dashboard/admin' },
  { title: 'Configuração sletiva', link: '/dashboard/admin/configseletiva' },
]
export default function page() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <ConfigSeletiva />
      </div>
    </ScrollArea>
  )
}
