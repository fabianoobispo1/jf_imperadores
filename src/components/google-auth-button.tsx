'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

import { Icons } from './icons'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  async function handleLogin() {
    setLoading(true)

    const result = await signIn('google', {
      callbackUrl: callbackUrl ?? '/dashboard',
    })
    if (result?.error) {
      console.log(result)
    } else {
      setLoading(false)
      /*  window.location.href = result?.url ?? '/dashboard'; */
    }
    setLoading(false)
  }
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      disabled={loading}
      onClick={() => handleLogin()}
    >
      {loading ? <Loader2 className="animate-spin" /> : ''}
      <Icons.google className="mr-2 h-4 w-4" />
      Continue Com Google
    </Button>
  )
}
