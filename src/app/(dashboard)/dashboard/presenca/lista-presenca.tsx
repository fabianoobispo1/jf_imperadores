'use client'
import { useQuery, useMutation } from 'convex/react'
import { useState } from 'react'

import { api } from '@/convex/_generated/api'
import { Checkbox } from '@/components/ui/checkbox'
import type { Id } from '@/convex/_generated/dataModel'
import { Spinner } from '@/components/ui/spinner'

interface ListaPresencaProps {
  data: Date
}

export const ListaPresenca: React.FC<ListaPresencaProps> = ({ data }) => {
  const timestamp = data.getTime()
  const presencas = useQuery(api.presenca.getPresencasByData, {
    data_treino: timestamp,
  })
  const atletas = useQuery(api.atletas.getAllAtivos)
  const salvarPresenca = useMutation(api.presenca.salvarPresenca)
  const [saving, setSaving] = useState(false)

  // Verifica se um atleta está presente
  const isPresente = (atletaId: Id<'atletas'>) => {
    return (
      presencas?.some((p) => p.atleta_id === atletaId && p.presente) || false
    )
  }

  // Manipula a alteração de presença
  const handlePresenca = async (atletaId: Id<'atletas'>, presente: boolean) => {
    try {
      setSaving(true)
      console.log(`Salvando presença para atleta ${atletaId}: ${presente}`)

      await salvarPresenca({
        atleta_id: atletaId,
        data_treino: timestamp,
        presente,
        observacao: '',
      })

      console.log('Presença salva com sucesso')
    } catch (error) {
      console.error('Erro ao salvar presença:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!atletas) {
    return (
      <div className="flex justify-center my-4">
        <Spinner />
      </div>
    )
  }

  const atletasOrdenados = [...atletas].sort((a, b) =>
    a.nome.localeCompare(b.nome),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Lista de Presença - {data.toLocaleDateString()}
        </h3>
      </div>

      <div className="space-y-2">
        {atletasOrdenados.map((atleta) => (
          <div
            key={atleta.id}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <Checkbox
              checked={isPresente(atleta.id)}
              disabled={saving}
              onCheckedChange={(checked) =>
                handlePresenca(atleta.id, !!checked)
              }
            />
            <span>{atleta.nome}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
