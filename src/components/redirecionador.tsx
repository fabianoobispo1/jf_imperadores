'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Spinner } from './ui/spinner'

// Tipagem para as props do componente
interface RedirecionadorProps {
  link: string
}

export default function Redirecionador({ link }: RedirecionadorProps) {
  const router = useRouter()

  useEffect(() => {
    if (link) {
      router.push(link) // Redireciona para o link fornecido
    }
  }, [link, router]) // Adicione dependências ao array

  return <Spinner />
}
