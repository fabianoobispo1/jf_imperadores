import BreadCrumb from '@/components/breadcrumb'

import { Presenca } from './presenca'
const breadcrumbItems = [{ title: 'Controle de Presença', link: '/dashboard/presenca' }]
export default function PresencaPage() {
  return (
    <div className="w-full space-y-4 p-4 pt-6 ">
      <BreadCrumb items={breadcrumbItems} />
      <Presenca />
    </div>
  )
}
