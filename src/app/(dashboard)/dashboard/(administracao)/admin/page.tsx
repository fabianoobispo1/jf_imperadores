'use client'
import { useRouter } from 'next/navigation'

import BreadCrumb from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { VerificaAdmin } from '@/components/VerificaAdmin'

const breadcrumbItems = [{ title: 'Administração', link: '/dashboard/admin' }]
export default function Page() {
  const router = useRouter()

  const handleNavigation = () => {
    router.push('/dashboard/admin/administradores')
  }
  const handleNavigationSeletiva = () => {
    router.push('/dashboard/admin/configseletiva')
  }
  const handleNavigationExercicio = () => {
    router.push('/dashboard/admin/exercicios')
  }
  const handleNavigationGerenciarTempo = () => {
    router.push('/dashboard/admin/gerenciartempos')
  }

  return (
    <ScrollArea className="h-full w-full">
      <VerificaAdmin />
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading
            title={'Administração'}
            description={'Informações administrativas'}
          />
        </div>

        <div>
          <Button onClick={handleNavigation}>Administradores</Button>
        </div>
        <div>
          <Button onClick={handleNavigationSeletiva}>
            Configuração seletiva
          </Button>
        </div>
        <div>
          <Button onClick={handleNavigationExercicio}>
            Configuração Exercício
          </Button>
        </div>
        <div>
          <Button onClick={handleNavigationGerenciarTempo}>
            Gerenciar Tempos
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}