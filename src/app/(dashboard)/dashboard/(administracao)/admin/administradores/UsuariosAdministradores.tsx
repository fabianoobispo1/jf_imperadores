'use client'
import { useCallback, useEffect, useState } from 'react'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { useSession } from 'next-auth/react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

import type { Id } from '../../../../../../../convex/_generated/dataModel'
import { api } from '../../../../../../../convex/_generated/api'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'

interface User {
  _id: Id<'user'>
  nome: string
  email: string
  role: 'user' | 'admin'
}

export function UsuariosAdministradores() {
  const [usuarios, setusuarios] = useState<User[]>([])
  const [carregou, setiscarregou] = useState(false)
  const [loadingUsuario, setLoadingUsuario] = useState<boolean>(false)
  const { data: session } = useSession()

  const loadUsuarios = useCallback(async () => {
    if (session) {
      fetchQuery(api.user.getAllUserRole).then((result) => {
        setusuarios(result)
      })
    }
  }, [session])

  useEffect(() => {
    if (session) {
      if (!carregou) {
        loadUsuarios()
        setiscarregou(true)
      }
    }
  }, [loadUsuarios, session, carregou, setiscarregou])

  const toggleAdmin = async (id: Id<'user'>) => {
    setLoadingUsuario(true)

    await fetchMutation(api.user.toggleUserRole, {
      userId: id,
    })

    loadUsuarios()
    setLoadingUsuario(false)
  }

  return (
    <div className="space-y-8">
      <ScrollArea className="h-[calc(80vh-220px)] w-full overflow-x-auto rounded-md border">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-center">Nome</TableHead>
              <TableHead className="text-center">email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {usuarios ? (
              usuarios.map((usuario) => (
                <TableRow key={usuario._id}>
                  <TableCell className="text-center">
                    <Checkbox
                      disabled={loadingUsuario}
                      checked={usuario.role === 'admin'}
                      onCheckedChange={() => toggleAdmin(usuario._id)}
                    />
                  </TableCell>

                  <TableCell className="text-center">{usuario.nome}</TableCell>
                  <TableCell className="text-center">{usuario.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <Spinner />
            )}
          </TableBody>
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
