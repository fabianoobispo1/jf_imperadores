import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'

import { MensalidadeForm } from './mensalidades-form'

const breadcrumbItems = [
  { title: 'Mensalidades', link: '/dashboard/mensalidades' },
  { title: 'Cadastrar', link: '/dashboard/mensalidades/cadastrar' },
]
export default function Page() {
  return (
    <div className="w-full space-y-4 p-4 pt-6 ">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flexrow flex items-start justify-between gap-4 ">
        <Heading title="Mensalidades - Cadastrar" description="Cadastro de mensalidades" />
      </div>
      <MensalidadeForm />
    </div>
  )
}
