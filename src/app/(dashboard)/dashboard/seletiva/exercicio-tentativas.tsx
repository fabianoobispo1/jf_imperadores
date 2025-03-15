'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ExercicioTentativasProps {
  seletivaId: Id<'seletiva'>
  exercicioId: Id<'exercicios'>
}

export const ExercicioTentativas = ({
  seletivaId,
  exercicioId,
}: ExercicioTentativasProps) => {
  const tentativas = useQuery(api.exercicios.getTentativasBySeletivaExercicio, {
    seletiva_id: seletivaId,
    exercicio_id: exercicioId,
  })

  const exercicio = useQuery(api.exercicios.getExercicioById, {
    id: exercicioId,
  })

  if (!tentativas || tentativas.length === 0) {
    return <span className="text-gray-400">-</span>
  }

  // Ordena as tentativas pelo número da tentativa
  const tentativasOrdenadas = [...tentativas].sort(
    (a, b) => a.tentativa - b.tentativa,
  )

  // Encontra o melhor tempo
  const melhorTempo = Math.min(...tentativasOrdenadas.map((t) => t.tempo))

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex flex-col gap-1">
            {tentativasOrdenadas.map((tentativa) => (
              <div
                key={tentativa._id}
                className={cn(
                  'text-sm px-2 py-1 rounded',
                  tentativa.tempo === melhorTempo &&
                    'bg-green-100 font-semibold',
                )}
              >
                {tentativa.tentativa}ª: {tentativa.tempo} s
              </div>
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{exercicio?.nome}</p>
          <p className="text-sm text-muted-foreground">
            Melhor tempo: {melhorTempo}s
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
