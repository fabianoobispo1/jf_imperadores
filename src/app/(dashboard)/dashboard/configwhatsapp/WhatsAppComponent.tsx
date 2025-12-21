'use client'
import axios from 'axios'
import { useCallback, useState } from 'react'
/* import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation' */
import Image from 'next/image'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPhone } from '@/lib/utils'


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'

export function WhatsAppComponent() {
  /*   const { data: session } = useSession()
  const [carregou, setiscarregou] = useState(false)
  const router = useRouter()
  if (session) {
    if (!carregou) {
      console.log(session.user.nome)
      if (
        session.user.email === 'fbc623@gmail.com' ||
        session.user.email === 'markinjr92@gmail.com'
      ) {
        console.log('ok')
      } else {
        router.push('https://www.jfimperadores.com.br/dashboard')
      }
      setiscarregou(true)
    }
  } */

  /*  const [sessionData, setSessionData] = useState(null) */
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrKey, setQrKey] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [numeroConectado, setNumeroConectado] = useState('')
  const [nomeConectado, setNomeConectado] = useState('')
  const [mesageColor, setMesageColor] = useState('')
  const [messageType, setMessageType] = useState('string')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sessionName, setSessionName] = useState('')

  const [qrCodeImage, setQrCodeImage] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const startWhatsAppSession = async () => {
    setLoading(true)
    try {
      await axios.get('/api/whatsapp/start', {
        params: { sessionName },
      })
      await checkStatus()
    } catch (error) {
      console.error('Error starting WhatsApp session:', error)
    }
    /*  checkStatus() */
    setLoading(false)
  }

  const terminateWhatsAppSessions = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/whatsapp/terminate', {
        params: { sessionName },
      })
      /* setSessionData(response.data) */
      console.log(response.data)
      setShowQR(false)
    } catch (error) {
      console.error('Error terminating WhatsApp sessions:', error)
    }
    /*  checkStatus() */
    setLoading(false)
  }

  const fetchQRCode = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/whatsapp/qrcode`, {
        params: { sessionName },
        responseType: 'blob', // Importante para receber a imagem
      })

      // Verificar se realmente é uma imagem
      if (response.data.type === 'application/json') {
        // Se retornou JSON, é porque houve erro
        const reader = new FileReader()
        reader.onload = () => {
          const errorData = JSON.parse(reader.result as string)
          console.error('QR Code error:', errorData)
          toast.error(`Erro ao gerar QR Code: ${errorData.error || 'Erro desconhecido'}`)
        }
        reader.readAsText(response.data)
        setLoading(false)
        return
      }

      // Converter o blob para URL
      const imageUrl = URL.createObjectURL(response.data)
      setQrCodeImage(imageUrl)
      setShowQR(true)
      setQrKey((prev) => prev + 1)
      toast.success('QR Code gerado com sucesso!')
    } catch (error: any) {
      console.error('Error fetching QR code:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Erro ao gerar QR Code'
      toast.error(`Erro: ${errorMsg}`)
    }
    setLoading(false)
  }

  const sendMessage = async () => {
    setLoading(true)
    try {
      const formattedPhone = phoneNumber.replace(/\D/g, '')
      const chatId = `55${formattedPhone}@c.us`

      if (messageType === 'MessageMedia' && selectedFile) {
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = async () => {
          const base64Data = (reader.result as string).split(',')[1]
          console.log(sessionName)
          const response = await axios.post('/api/whatsapp/sendMessage', {
            chatId,
            contentType: 'MessageMedia',
            content: {
              mimetype: selectedFile.type,
              data: base64Data,
              filename: selectedFile.name,
            },
            params: { sessionName },
          })
          console.log(response.data)
          setSelectedFile(null)
        }
      } else {
        console.log(sessionName)
        const response = await axios.post('/api/whatsapp/sendMessage', {
          chatId,
          contentType: 'string',
          content: message,
          params: { sessionName },
        })
        console.log(response.data)
        setMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
    setLoading(false)
  }

  const getNumber = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/whatsapp/getNumber', {
        params: { sessionName },
      })
      setNomeConectado(response.data.sessionInfo.pushname)
      setNumeroConectado(
        response.data.sessionInfo.me.user.slice(2, 4) +
          '9' +
          response.data.sessionInfo.me.user.slice(4),
      )
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }, [setLoading, setNumeroConectado, sessionName])

  const checkStatus = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/whatsapp/status', {
        params: { sessionName },
      })
      console.log(response.data)
      if (response.data.message === 'session_not_found') {
        setStatusMessage('Sessão não iniciada.')
        setMesageColor('text-red-500')
      } else if (response.data.message === 'session_not_connected') {
        setStatusMessage('Sessão Iniciada, falta ler QR Code.')
        setMesageColor('text-blue-600')
      } else if (response.data.message === 'session_connected') {
        getNumber()
        setMesageColor('text-green-500')
        setStatusMessage('Conectado')
      } else {
        setMesageColor('text-red-500')
        setStatusMessage('Erro Interno.')
      }
    } catch (error) {
      console.error('Error checking status:', error)
    }
    setLoading(false)
  }, [getNumber, setLoading, setStatusMessage, setMesageColor, sessionName])

  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-full overflow-x-auto ">
      <div className=" space-y-4">
        <p className="text-sm font-medium">
          Status:{' '}
          <span className={mesageColor}>
            {''} {statusMessage}
          </span>
        </p>
        <p className="text-sm font-medium">
          Número Conectado:{' '}
          <span>
            {''}
            {numeroConectado === '' ? '-' : formatPhone(numeroConectado)}
            {' - '}
            {nomeConectado === '' ? '-' : nomeConectado}
          </span>
        </p>

        <div className="flex flex-col gap-2 max-w-md">
          <Input
            placeholder="Nome da sessão"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <Button
            onClick={startWhatsAppSession}
            disabled={loading || !sessionName}
          >
            Iniciar sessão
          </Button>

          <Button
            onClick={terminateWhatsAppSessions}
            disabled={loading}
            variant="destructive"
          >
            Terminar sessão
          </Button>

          <Button
            onClick={fetchQRCode}
            disabled={loading || !sessionName}
            variant="outline"
          >
            gerar QR Code
          </Button>

          <Button
            onClick={checkStatus}
            disabled={loading || !sessionName}
            variant="secondary"
          >
            Verfica status
          </Button>
        </div>

        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Teste enviar mensagem</h3>
          <div className="flex flex-col gap-2 max-w-md">
            <Input
              placeholder="Numero telefone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de mensagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Texto</SelectItem>
                <SelectItem value="MessageMedia">imagem</SelectItem>
              </SelectContent>
            </Select>

            {messageType === 'string' ? (
              <Input
                placeholder="Mensagem de texto"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            ) : (
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            )}
            <Button
              onClick={sendMessage}
              disabled={
                loading ||
                !phoneNumber ||
                (messageType === 'string' ? !message : !selectedFile)
              }
            >
              Enviar
            </Button>
          </div>
        </div>

        {showQR && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">QR Code</h3>
            <div className="border rounded p-4 inline-block bg-white relative">
              {qrCodeImage && (
                <Image
                  key={qrKey}
                  src={qrCodeImage}
                  alt="WhatsApp QR Code"
                  width={450}
                  height={450}
                  className="object-contain"
                />
              )}
            </div>
          </div>
        )}

        {/* {sessionData && (
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        )} */}
      </div>
    </ScrollArea>
  )
}