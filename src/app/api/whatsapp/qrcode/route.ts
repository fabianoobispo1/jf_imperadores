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

  const response = await fetch(`${baseUrl}/session/qr/${sessionName}/image`, {
    headers: {
      accept: 'image/png',
      'x-api-key': apiKey,
    },
  })

  console.log(response)
  const imageBuffer = await response.arrayBuffer()
  console.log(imageBuffer)
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
