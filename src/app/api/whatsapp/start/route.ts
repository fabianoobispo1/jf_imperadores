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

  const response = await fetch(`${baseUrl}/session/start/${sessionName}`, {
    headers: {
      accept: 'application/json',
      'x-api-key': apiKey,
    },
  })

  const data = await response.json()
  return NextResponse.json(data)
}
