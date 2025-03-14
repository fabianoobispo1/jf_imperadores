import BreadCrumb from '@/components/breadcrumb'
import { ExerciciosForm } from '@/components/forms/exercicios-form'
import { ScrollArea } from '@/components/ui/scroll-area'

const breadcrumbItems = [
  { title: 'Administração', link: '/dashboard/admin' },
  { title: 'Configuração Exercicios', link: '/dashboard/admin/exercicios' },
]
export default function page() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <ExerciciosForm />
      </div>
    </ScrollArea>
  )
}
