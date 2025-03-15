import { ScrollArea } from '@/components/ui/scroll-area'
import BreadCrumb from '@/components/breadcrumb'

import { TryoutExercicios } from './tryout-exercicios'

const breadcrumbItems = [
  { title: 'Seletiva', link: '/dashboard/seletiva' },
  { title: 'Seletiva Exercicios', link: '/dashboard/seletivaexercicios' },
]
export default function page() {
  return (
    <ScrollArea className="h-full w-full md:w-[calc(100%-5rem)]">
      <div className="w-full space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <TryoutExercicios />
      </div>
    </ScrollArea>
  )
}
