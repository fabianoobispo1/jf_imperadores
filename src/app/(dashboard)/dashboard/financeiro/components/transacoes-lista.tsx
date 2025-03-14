'use client'
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Plus, Trash } from 'lucide-react'
import { fetchMutation } from 'convex/nextjs'
import { useSession } from 'next-auth/react'

import { api } from '@/convex/_generated/api'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import type { Id } from '@/convex/_generated/dataModel'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { TransacaoForm } from './transacao-form'

interface TransacaoType {
  _id: string
  tipo: string
  descricao: string
  valor: number
  data: number
  categoria: string
  status: string
}

export function TransacoesLista() {
  const [open, setOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { data: session } = useSession()
  const emailsPermitidos = ['mh.oliveira.85@gmail.com', 'fbc623@gmail.com']

  const [selectedTransaction, setSelectedTransaction] = useState<string | undefined>(undefined)

  const temPermissaoAdicionar = () => {
    const emailUsuario = session?.user?.email
    return emailUsuario ? emailsPermitidos.includes(emailUsuario) : false
  }

  const transacoes = useQuery(api.financas.getTransacoes, {})

  const columns: ColumnDef<TransacaoType>[] = [
    {
      accessorKey: 'data',
      header: 'Data',
      cell: ({ row }) => format(row.original.data, 'dd/MM/yyyy', { locale: ptBR }),
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant={row.original.tipo === 'receita' ? 'default' : 'destructive'}>
          {row.original.tipo === 'receita' ? 'Receita' : 'Despesa'}
        </Badge>
      ),
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
    },
    {
      accessorKey: 'categoria',
      header: 'Categoria',
      cell: ({ row }) => <Badge variant="outline">{row.original.categoria}</Badge>,
    },
    {
      accessorKey: 'valor',
      header: 'Valor',
      cell: ({ row }) => (
        <div
          className={cn(
            'font-medium',
            row.original.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(row.original.valor)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'confirmado' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original._id)}>
              <Trash className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: transacoes || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleEdit = (id: string) => {
    setSelectedTransaction(id)
    setOpen(true)
  }
  const handleCloseModal = () => {
    setSelectedTransaction(undefined)
    setOpen(false)
  }

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
        await fetchMutation(api.financas.remove, {
          financaId: id as Id<'financas'>,
        })

        toast.success('Ok', {
          description: 'Transação excluída com sucesso',
          duration: 3000,
          richColors: true,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro', {
        description: 'Não foi possível excluir a transação',

        duration: 3000,
        richColors: true,
      })
    }
  }

  return (
    <div className="space-y-4 mr-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrar por descrição..."
          value={(table.getColumn('descricao')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('descricao')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        {temPermissaoAdicionar() ? (
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full overflow-auto">
        <div className="w-full pr-4">
          {/* Largura mínima para garantir que todas as colunas fiquem visíveis */}
          <ScrollArea className="h-[calc(80vh-220px)] w-full  rounded-md border pr-2">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTransaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
            <DialogDescription>
              {selectedTransaction
                ? 'Atualize os dados da transação financeira'
                : 'Registre uma nova movimentação financeira'}
            </DialogDescription>
          </DialogHeader>
          <TransacaoForm id={selectedTransaction} onSuccess={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
