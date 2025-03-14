'use client'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Heading } from '@/components/ui/heading'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/ui/sidebar'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { ListaPresenca } from './lista-presenca'

export const Presenca: React.FC = () => {
  const { open } = useSidebar()
  const [dataSelecionada, setDataSelecionada] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const methods = useForm()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // Cria a data no fuso horário local
      const [year, month, day] = e.target.value.split('-').map(Number)
      const novaData = new Date(year, month - 1, day)
      novaData.setHours(0, 0, 0, 0)
      setDataSelecionada(novaData)
    }
  }

  // Formatar a data para o formato YYYY-MM-DD para o input type="date"
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <>
      <div className="flexrow flex items-start justify-between gap-2 ">
        <Heading
          title="Controle de Presença"
          description="Gerencie a presença dos atletas nos treinos."
        />
      </div>
      <ScrollArea
        className={cn(
          'space-y-8 w-screen pr-8    h-[calc(100vh-220px)]',
          open ? 'md:max-w-[calc(100%-16rem)] ' : 'md:max-w-[calc(100%-5rem)] ',
        )}
      >
        <FormProvider {...methods}>
          <div className="p-4 border rounded-lg flex flex-col gap-2">
            <FormField
              name="data_treino"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do treino</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={formatDateForInput(dataSelecionada)}
                      onChange={handleDateChange}
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <ListaPresenca data={new Date(dataSelecionada.getTime() + dataSelecionada.getTimezoneOffset() * 60000)} />
          </div>
        </FormProvider>
      </ScrollArea>
    </>
  )
}
