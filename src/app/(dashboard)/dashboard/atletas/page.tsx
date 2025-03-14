import BreadCrumb from '@/components/breadcrumb'

import { Atletas } from './atletas'

const breadcrumbItems = [{ title: 'Atletas', link: '/dashboard/atletas' }]
export default function page() {
  return (
    <div className="w-full space-y-4 p-4 pt-6 ">
      <BreadCrumb items={breadcrumbItems} />
      <Atletas />
    </div>
  )
}
