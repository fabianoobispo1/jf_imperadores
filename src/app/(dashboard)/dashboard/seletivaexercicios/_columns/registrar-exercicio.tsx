'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Id } from '@/convex/_generated/dataModel'

export interface RegistrarExercicioProps {
  seletivaId: Id<'seletiva'>
  onSuccess: () => void
}

export const RegistrarExercicio = ({ seletivaId, onSuccess }: RegistrarExercicioProps) => {
  const [open, setOpen] = useState(false)
  const [exercicioId, setExercicioId] = useState<Id<'exercicios'> | null>(null)
  const [tentativa, setTentativa] = useState<number>(1)
  const [tempo, setTempo] = useState('')
  const [tentativasDisponiveis, setTentativasDisponiveis] = useState<number[]>([1, 2, 3])

  const exercicios = useQuery(api.exercicios.getAll)
  const registrarTentativa = useMutation(api.exercicios.registrarTentativa)

  // Busca tentativas existentes quando um exercício é selecionado
  const tentativasExistentes = useQuery(
    api.exercicios.getTentativasBySeletivaExercicio,
    exercicioId ? { seletiva_id: seletivaId, exercicio_id: exercicioId } : 'skip'
  )

  // Atualiza tentativas disponíveis quando as existentes mudam
  useEffect(() => {
    if (tentativasExistentes) {
      const tentativasUsadas = tentativasExistentes.map((t) => t.tentativa)
      const disponiveis = [1, 2, 3].filter((n) => !tentativasUsadas.includes(n))
      setTentativasDisponiveis(disponiveis)

      // Seleciona a primeira tentativa disponível
      if (disponiveis.length > 0) {
        setTentativa(disponiveis[0])
      }
    }
  }, [tentativasExistentes])

  const onSubmit = async () => {
    if (!exercicioId) return

    try {
      await registrarTentativa({
        seletiva_id: seletivaId,
        exercicio_id: exercicioId,
        tentativa,
        tempo: parseFloat(tempo),
      })

      toast.success('Sucesso!', {
        description: 'Exercício registrado com sucesso',
        duration: 3000,
        richColors: true,
      })

      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Erro', {
        description: 'Ocorreu um erro ao registrar o exercício',
        duration: 3000,
        richColors: true,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Registrar Exercício</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Exercício</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select
            value={exercicioId ?? ''}
            onValueChange={(value) => setExercicioId(value as Id<'exercicios'>)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o exercício" />
            </SelectTrigger>
            <SelectContent>
              {exercicios?.map((exercicio) => (
                <SelectItem key={exercicio._id} value={exercicio._id}>
                  {exercicio.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(tentativa)}
            onValueChange={(value) => setTentativa(parseInt(value))}
            disabled={tentativasDisponiveis.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a tentativa" />
            </SelectTrigger>
            <SelectContent>
              {tentativasDisponiveis.map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}ª Tentativa
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Tempo (em segundos)"
            type="number"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            disabled={tentativasDisponiveis.length === 0}
          />

          <Button onClick={onSubmit} disabled={tentativasDisponiveis.length === 0 || !exercicioId}>
            {tentativasDisponiveis.length === 0 ? 'Todas tentativas registradas' : 'Salvar'}
          </Button>
        </div>

        {/* Tabela de tentativas registradas */}
        {tentativasExistentes && tentativasExistentes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Tentativas Registradas</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tentativa</TableHead>
                  <TableHead>Tempo (s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tentativasExistentes.map((tentativa) => (
                  <TableRow key={tentativa._id}>
                    <TableCell>{tentativa.tentativa}ª Tentativa</TableCell>
                    <TableCell>{tentativa.tempo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
