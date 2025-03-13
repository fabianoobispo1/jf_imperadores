import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { TodoList } from '@/components/TodoList'

const breadcrumbItems = [
  { title: 'Lista de tarefas', link: '/dashboard/lista' },
]
export default function page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 ">
      <BreadCrumb items={breadcrumbItems} />
      <div className=" flex items-start justify-between gap-4">
        <Heading
          title={'Lista de tarefas'}
          description={'Essa e sua lista de tarefas.'}
        />
      </div>
      <TodoList />
    </div>
  )
}
