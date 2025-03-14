import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { VerificaAdmin } from '@/components/VerificaAdmin'

import { Produtos } from './produtos'

const breadcrumbItems = [
  { title: 'Mensalidade', link: '/dashboard/mensalidade' },
]
export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 ">
      <BreadCrumb items={breadcrumbItems} />
      <div className=" flex items-start justify-between gap-4">
        <Heading title={'Mensalidade'} description={'....'} />
      </div>
      <Produtos />
      <VerificaAdmin />
    </div>
  )
}
