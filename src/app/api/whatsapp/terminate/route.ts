import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionName = searchParams.get('sessionName')
  const baseUrl = process.env.API_WHATSAPP
  const apiKey = process.env.WHATSAPP_API_KEY

  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { error: 'WHATSAPP_API_URL or API_KEY not configured' },
      { status: 500 },
    )
  }

  try {
    // Primeiro faz logout
    const logoutResponse = await fetch(`${baseUrl}/instance/logout/${sessionName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
    })

    // Depois deleta a instância
    const deleteResponse = await fetch(`${baseUrl}/instance/delete/${sessionName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
    })

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json()
      console.error('Delete error:', errorData)
    }

    const data = await deleteResponse.json()
    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error('Error terminating session:', error)
    return NextResponse.json(
      { error: 'Failed to terminate session', details: error },
      { status: 500 },
    )
  }
}
