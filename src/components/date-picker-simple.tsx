'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

interface DatePickerSimpleProps {
  timestamp: number | undefined
  setTimestamp: (timestamp: number | undefined) => void
  placeholder?: string
  className?: string
  disabledDays?: (date: Date) => boolean
}

export function DatePickerSimple({
  timestamp,
  setTimestamp,
  placeholder = 'Selecione uma data',
  className,
  disabledDays = (date) => date >= new Date(),
}: DatePickerSimpleProps) {
  const [open, setOpen] = React.useState(false)

  // Converter timestamp para Date para exibição no calendário
  const date = timestamp ? new Date(timestamp) : undefined

  // Função para lidar com a seleção de data
  const handleSelect = (selectedDate: Date | undefined) => {
    // Converter Date para timestamp ou undefined
    if (selectedDate) {
      // Normalizar para meio-dia para evitar problemas de fuso horário
      const normalizedDate = new Date(selectedDate)
      normalizedDate.setHours(12, 0, 0, 0)
      setTimestamp(normalizedDate.getTime())
    } else {
      setTimestamp(undefined)
    }

    // Fechar o popover após a seleção
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'min-w-[200px] justify-start px-2 font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          disabled={disabledDays}
          locale={ptBR}
          weekStartsOn={0} // 0 = domingo como primeiro dia da semana
          className="rounded-md border"
          // Traduções para os botões de navegação
          classNames={{
            caption_label: 'font-medium text-sm',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
            cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
            day_selected:
              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
          // Traduções para os meses e dias da semana
          formatters={{
            formatCaption: (date, options) => format(date, 'LLLL yyyy', { locale: ptBR }),
            formatWeekdayName: (date) => format(date, 'EEEEEE', { locale: ptBR }).toUpperCase(),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
