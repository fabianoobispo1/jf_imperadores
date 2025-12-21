import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

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
    // Na Evolution API v2.2.1, o QR code vem como base64 no JSON
    const response = await fetch(`${baseUrl}/instance/connect/${sessionName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('QR Code error:', errorData)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('QR Code response keys:', Object.keys(data))
    console.log('Has base64?', !!data.base64)
    console.log('Has code?', !!data.code)

    // Se o QR code vier como base64 na resposta (formato mais antigo)
    if (data.base64) {
      const base64String = data.base64
      const base64Data = base64String.replace(/^data:image\/png;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    }
    
    // Se vier como code (texto do QR) - gerar imagem a partir do texto
    if (data.code) {
      console.log('Generating QR code image from text, length:', data.code.length)
      
      try {
        // Gerar QR code como buffer PNG a partir do texto
        const qrBuffer = await QRCode.toBuffer(data.code, {
          type: 'png',
          width: 400,
          margin: 2,
          errorCorrectionLevel: 'M',
        })
        
        console.log('QR code generated successfully, buffer size:', qrBuffer.length)
        
        return new NextResponse(qrBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        })
      } catch (qrError: any) {
        console.error('Error generating QR code image:', qrError)
        console.error('Stack:', qrError.stack)
        return NextResponse.json(
          { error: 'Failed to generate QR code image', details: qrError.message },
          { status: 500 },
        )
      }
    }

    // Se não houver QR code, pode ser que já esteja conectado
    if (data.instance?.state === 'open') {
      return NextResponse.json(
        { error: 'Instance already connected', connected: true },
        { status: 400 },
      )
    }

    throw new Error('QR code not found in response')
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR code', details: String(error) },
      { status: 500 },
    )
  }
}
