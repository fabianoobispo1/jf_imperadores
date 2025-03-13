'use client'
import { useCallback, useEffect, useState } from 'react'
import { Loader2, Trash } from 'lucide-react'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { useSession } from 'next-auth/react'
import { useMutation } from 'convex/react'

import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { Spinner } from './ui/spinner'

import { Button } from './ui/button'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface Todo {
  _id: Id<'todo'>
  _creationTime: number
  text: string
  isCompleted: boolean
  created_at: number
  updated_at: number
  userId: Id<'user'>
}
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const [newTodo, setNewTodo] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [loadingTodo, setLoadingTodo] = useState<boolean>(false)

  const registerTodo = useMutation(api.todo.create)

  const { data: session } = useSession()

  const loadTodos = useCallback(async () => {
    if (session) {
      fetchQuery(api.todo.getTodoByUser, {
        userId: session.user.id as Id<'user'>,
      }).then((result) => {
        setTodos(result)
      })
    }
  }, [session])

  useEffect(() => {
    if (session) {
      loadTodos()
    }
  }, [loadTodos, session])

  const addTodo = async () => {
    setLoading(true)
    if (newTodo.trim() === '') {
      setLoading(false)
      return
    }

    if (session) {
      await registerTodo({
        userId: session.user.id as Id<'user'>,
        text: newTodo,
        isCompleted: false,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      })

      setNewTodo('')
      setLoading(false)
      loadTodos()
    }
  }

  const toggleTodo = async (id: Id<'todo'>) => {
    setLoadingTodo(true)
    console.log(id)

    await fetchMutation(api.todo.toggleTodoCompletion, {
      todoId: id,
    })

    loadTodos()
    setLoadingTodo(false)
  }

  const removeTodo = async (id: Id<'todo'>) => {
    setLoadingTodo(true)

    await fetchMutation(api.todo.remove, { todoId: id })

    loadTodos()
    setLoadingTodo(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Adicionar nova tarefa"
        />
        <Button disabled={loading} onClick={addTodo} className="ml-2">
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Adicionar
            </>
          ) : (
            'Adicionar'
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(80vh-220px)] w-full overflow-x-auto rounded-md border">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Tarefa</TableHead>
              <TableHead className="text-center">Completou</TableHead>
              <TableHead className="text-center">Criado em</TableHead>
              <TableHead className="text-center">Opções</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {todos ? (
              todos.map((todo) => (
                <TableRow key={todo._id}>
                  <TableCell>{todo.text}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={todo.isCompleted}
                      onCheckedChange={() => toggleTodo(todo._id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(todo.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      className="w-32"
                      disabled={loadingTodo}
                      onClick={() => toggleTodo(todo._id)}
                    >
                      {loadingTodo ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Carregando
                        </>
                      ) : todo.isCompleted ? (
                        'Desfazer'
                      ) : (
                        'Completo'
                      )}
                    </Button>
                    <Button
                      disabled={loadingTodo}
                      variant={'destructive'}
                      onClick={() => removeTodo(todo._id)}
                    >
                      {loadingTodo ? (
                        <>
                          <Loader2 className="animate-spin" />
                          <Trash className="h-4 w-4" />
                        </>
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
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
