'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'
import { VendacamisaForm } from './forms/vendacamisa-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function VendacamisaList() {
  const vendas = useQuery(api.vendacamisa.getAll)
  const remove = useMutation(api.vendacamisa.remove)
  const [selectedVenda, setSelectedVenda] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedVenda) return

    try {
      setIsLoading(true)
      await remove({ id: selectedVenda._id })
      toast.success('Venda deletada com sucesso')
      setIsDeleteDialogOpen(false)
      setSelectedVenda(null)
    } catch (error) {
      const err = error as Error
      toast.error(err.message || 'Erro ao deletar venda')
    } finally {
      setIsLoading(false)
    }
  }

  if (vendas === undefined) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Nome</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas && vendas.length > 0 ? (
              vendas.map((venda) => (
                <TableRow key={venda._id}>
                  <TableCell className="font-medium">{venda.nome}</TableCell>
                  <TableCell>{venda.numero}</TableCell>
                  <TableCell>{venda.tamanho}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVenda(venda)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVenda(venda)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Venda de Camisa</DialogTitle>
            <DialogDescription>
              Atualize as informações da venda de camisa
            </DialogDescription>
          </DialogHeader>
          {selectedVenda && (
            <VendacamisaForm
              initialData={selectedVenda}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setSelectedVenda(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Deletar Venda</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar a venda de {selectedVenda?.nome}? Esta ação não pode
            ser desfeita.
          </AlertDialogDescription>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
