import BreadCrumb from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heading } from '@/components/ui/heading'
import { PerfilForm } from '@/components/forms/perfil-form'

const breadcrumbItems = [{ title: 'Pefil', link: '/dashboard/perfil' }]
export default function page() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading title={'Perfil'} description={'Editar suas informações pessoais.'} />
        </div>
        <PerfilForm />
      </div>
    </ScrollArea>
  )
}
