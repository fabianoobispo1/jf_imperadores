import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const sessionName = body.params.sessionName

  const baseUrl = process.env.API_WHATSAPP
  const apiKey = process.env.WHATSAPP_API_KEY

  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { error: 'WHATSAPP_API_URL or API_KEY not configured' },
      { status: 500 },
    )
  }

  try {
    // Mapear o corpo da requisição para o formato da Evolution API v2.2.1
    let payload: any = {
      number: body.chatId.replace('@c.us', ''),
    }

    if (body.contentType === 'string') {
      // Mensagem de texto
      payload.text = body.content
    } else if (body.contentType === 'MessageMedia') {
      // Mensagem com mídia
      payload = {
        number: body.chatId.replace('@c.us', ''),
        mediatype: 'image',
        mimetype: body.content.mimetype,
        caption: '',
        media: body.content.data, // base64
        fileName: body.content.filename,
      }
    }

    const endpoint = body.contentType === 'MessageMedia' 
      ? `${baseUrl}/message/sendMedia/${sessionName}`
      : `${baseUrl}/message/sendText/${sessionName}`

    console.log('Sending message to:', endpoint, 'Payload:', payload)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    )
  }
}
