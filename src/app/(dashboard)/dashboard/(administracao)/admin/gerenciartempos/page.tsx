import BreadCrumb from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'

import { GerenciarTempos } from './gerenciarTempos'

const breadcrumbItems = [
  { title: 'Administração', link: '/dashboard/admin' },
  {
    title: 'Gerenciar  Tempos',
    link: '/dashboard/admin/gerenciartempos',
  },
]
export default function page() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <GerenciarTempos />
      </div>
    </ScrollArea>
  )
}