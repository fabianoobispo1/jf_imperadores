'use client'
import { Heading } from '@/components/ui/heading'

import { MensalidadesList } from './mensalidades-list'

export const Mensalidades: React.FC = () => {
  return (
    <>
      <div className="flexrow flex items-start justify-between gap-4 ">
        <Heading
          title="Mensalidades"
          description="Gerenciamento de mensalidades"
        />
        {/*  <Button
          onClick={() => {
            setExibeAdicionar(true)
            setExibeListar(false)
          }}
        >
          Adicionar
        </Button> */}
      </div>
      <MensalidadesList />
      {/* 
      {exibeListar && <MensalidadesList />}
      {exibeAdicionar && (
        <ScrollArea className="h-[80vh] w-full px-4">
          <MensalidadesForm />
        </ScrollArea>
      )} */}
    </>
  )
}
