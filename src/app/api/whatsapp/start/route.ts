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
    // Primeiro tenta criar a instância (se já existir, retorna a existente)
    const createResponse = await fetch(`${baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        instanceName: sessionName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
    })

    const createData = await createResponse.json()
    console.log('Create instance response:', createData)

    // Agora conecta à instância
    const connectResponse = await fetch(`${baseUrl}/instance/connect/${sessionName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
    })

    if (!connectResponse.ok) {
      const errorData = await connectResponse.json()
      console.error('Connect error:', errorData)
      throw new Error(`HTTP error! status: ${connectResponse.status}`)
    }

    const data = await connectResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error starting session:', error)
    return NextResponse.json(
      { error: 'Failed to start session', details: error },
      { status: 500 },
    )
  }
}
