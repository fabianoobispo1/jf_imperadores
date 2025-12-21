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
    const response = await fetch(`${baseUrl}/instance/connectionState/${sessionName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Status response:', data)
    
    // Mapear resposta da Evolution API v2 para o formato esperado pelo frontend
    let message = 'session_not_found'
    if (data.instance) {
      const state = data.instance.state
      if (state === 'open') {
        message = 'session_connected'
      } else if (state === 'connecting' || state === 'close') {
        message = 'session_not_connected'
      } else {
        message = 'session_not_found'
      }
    }
    
    return NextResponse.json({ ...data, message })
  } catch (error) {
    console.error('Error checking status:', error)
    return NextResponse.json(
      { message: 'session_not_found', error: 'Failed to check status' },
      { status: 500 },
    )
  }
}
