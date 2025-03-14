'use client'

import { Heading } from '@/components/ui/heading'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/ui/sidebar'

import { AtletasList } from './atletas-list'

export const Atletas: React.FC = () => {
  const { open } = useSidebar()
  return (
    <>
      <div className="flexrow flex items-start justify-between gap-2 ">
        <Heading
          title="Atletas Ativos"
          description="Lista de atletas ativos do time."
        />
      </div>
      <ScrollArea
        className={cn(
          'space-y-8 w-screen pr-2   h-[calc(100vh-220px)]',
          open ? 'md:max-w-[calc(100%-16rem)] ' : 'md:max-w-[calc(100%-5rem)] ',
        )}
      >
        <AtletasList />
        {/*       <ExcelReader /> */}
      </ScrollArea>
    </>
  )
}
