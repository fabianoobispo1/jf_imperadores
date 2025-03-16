'use client'

import * as React from 'react'
import { format, parse, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

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
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    timestamp ? new Date(timestamp) : new Date()
  )
  const [inputValue, setInputValue] = React.useState<string>(
    timestamp ? format(new Date(timestamp), 'dd/MM/yyyy') : ''
  )

  // Converter timestamp para Date para exibição no calendário
  const date = timestamp ? new Date(timestamp) : undefined

  // Atualizar o inputValue quando o timestamp mudar externamente
  React.useEffect(() => {
    if (timestamp) {
      setInputValue(format(new Date(timestamp), 'dd/MM/yyyy'))
    } else {
      setInputValue('')
    }
  }, [timestamp])

  // Função para lidar com a seleção de data no calendário
  const handleSelect = (selectedDate: Date | undefined) => {
    // Converter Date para timestamp ou undefined
    if (selectedDate) {
      // Normalizar para meio-dia para evitar problemas de fuso horário
      const normalizedDate = new Date(selectedDate)
      normalizedDate.setHours(12, 0, 0, 0)
      setTimestamp(normalizedDate.getTime())
      setInputValue(format(normalizedDate, 'dd/MM/yyyy'))
    } else {
      setTimestamp(undefined)
      setInputValue('')
    }

    // Fechar o popover após a seleção
    setOpen(false)
  }

  // Função para formatar automaticamente a entrada com barras
  const formatDateInput = (value: string): string => {
    // Remover todos os caracteres não numéricos
    const numbersOnly = value.replace(/\D/g, '')

    // Aplicar o formato DD/MM/AAAA
    if (numbersOnly.length <= 2) {
      return numbersOnly
    } else if (numbersOnly.length <= 4) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`
    } else {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`
    }
  }

  // Função para lidar com a entrada de texto diretamente no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Formatar o valor com barras
    const formattedValue = formatDateInput(rawValue)
    setInputValue(formattedValue)

    // Se o campo estiver vazio, limpar a data
    if (!formattedValue.trim()) {
      setTimestamp(undefined)
      return
    }

    // Verificar se o formato está completo (DD/MM/AAAA)
    if (formattedValue.length === 10) {
      try {
        const parsedDate = parse(formattedValue, 'dd/MM/yyyy', new Date())

        if (isValid(parsedDate)) {
          // Normalizar para meio-dia para evitar problemas de fuso horário
          parsedDate.setHours(12, 0, 0, 0)

          // Atualizar o mês atual do calendário
          setCurrentMonth(parsedDate)

          // Atualizar o timestamp
          setTimestamp(parsedDate.getTime())
        }
      } catch (error) {
        // Não fazer nada em caso de erro de parsing
      }
    }
  }

  // Função para lidar com o clique no botão do calendário
  const handleButtonClick = () => {
    setOpen(true)
  }

  // Função para lidar com teclas especiais
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir teclas de navegação, backspace, delete, etc.
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Tab'
    ) {
      return
    }

    // Bloquear entrada de caracteres não numéricos
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault()
    }
  }

  // Gerar anos para o seletor (de 1900 até o ano atual)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

  // Gerar meses para o seletor
  const months = Array.from({ length: 12 }, (_, i) => i)

  // Manipuladores para os seletores de mês e ano
  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(parseInt(month))
    setCurrentMonth(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(parseInt(year))
    setCurrentMonth(newDate)
  }

  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn('pr-10', className)}
        maxLength={10} // Limitar a 10 caracteres (DD/MM/AAAA)
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 h-full rounded-l-none"
            onClick={handleButtonClick}
            type="button"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          {/* Seletores de mês e ano */}
          <div className="flex justify-between p-3 border-b">
            <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[120px] h-8 text-sm">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {format(new Date(2000, month, 1), 'MMMM', { locale: ptBR })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[90px] h-8 text-sm ml-2">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendário */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            initialFocus
            disabled={disabledDays}
            locale={ptBR}
            weekStartsOn={0}
            className="rounded-md"
            classNames={{
              caption_label: 'hidden', // Escondemos apenas o label do mês/ano
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
            formatters={{
              formatCaption: () => '', // Removemos o texto do caption, mas mantemos a estrutura
              formatWeekdayName: (date) => format(date, 'EEEEEE', { locale: ptBR }).toUpperCase(),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
