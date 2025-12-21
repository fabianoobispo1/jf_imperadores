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
    const response = await fetch(
      `${baseUrl}/instance/fetchInstances?instanceName=${sessionName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: apiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Instance info:', data)
    
    // A resposta é um array, pegar o primeiro elemento
    const instance = Array.isArray(data) ? data[0] : data
    
    // Mapear para o formato esperado pelo frontend
    const mappedData = {
      sessionInfo: {
        pushname: instance?.profileName || instance?.name || '',
        me: {
          user: instance?.ownerJid?.replace('@s.whatsapp.net', '') || '',
        },
      },
    }
    
    return NextResponse.json(mappedData)
  } catch (error) {
    console.error('Error getting number:', error)
    return NextResponse.json(
      { error: 'Failed to get number info' },
      { status: 500 },
    )
  }
}
