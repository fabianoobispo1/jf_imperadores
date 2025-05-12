'use client'
import { useCallback, useEffect, useState } from 'react'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
/* import axios from 'axios' */
import { jsPDF } from 'jspdf'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { FileDown } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import 'jspdf-autotable'
import { useSidebar } from '@/components/ui/sidebar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { cn, formatPhoneNumber } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import type { Id } from '../../../../../convex/_generated/dataModel'
import { api } from '../../../../../convex/_generated/api'
import { ExercicioTentativas } from './exercicio-tentativas'

// Enums para mostrar valores legíveis
const SETOR_LABELS = {
  1: 'Ataque',
  2: 'Defesa',
  3: 'Special Teams',
  4: 'Sem preferência',
} as const

const EQUIPAMENTO_LABELS = {
  1: 'Sim os dois equipamentos',
  2: 'Somente a ombreira',
  3: 'Somente capacete',
  4: 'Não possuo nenhum equipamento',
} as const

interface Seletivas {
  _id: Id<'seletiva'>
  _creationTime: number
  numerio_seletiva: number
  nome: string
  cpf: string
  data_nascimento?: number
  email: string
  altura: number
  peso: number
  celular: string
  tem_experiencia: boolean
  equipe_anterior: string
  setor: number
  posicao: string
  equipamento: number
  aprovado?: boolean
  img_link?: string
  cod_seletiva?: string
  transferido_atleta?: boolean
  img_key?: string
}
interface Exercicios {
  _id: Id<'exercicios'>
  _creationTime: number
  nome: string
  status: boolean
  descricao: string
}
export function TryoutList() {
  const [loading, setLoading] = useState<boolean>(false)
  const [seletivas, setSeletivas] = useState<Seletivas[]>([])
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 100
  const [pageLimit, setPageLimit] = useState(100)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [pesoDirection, setPesoDirection] = useState<'asc' | 'desc'>('asc')
  const [alturaDirection, setAlturaDirection] = useState<'asc' | 'desc'>('asc')

  const [dataCradastroDirection, setDataCradastroDirection] = useState<'asc' | 'desc'>('asc')
  const [codSeletivaDirection, setCodSeletivaDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedSeletiva, setSelectedSeletiva] = useState<Seletivas | null>(null)

  const [exercicios, setExercicios] = useState<Exercicios[]>([])
  const { open } = useSidebar()

  /*   const [whatsappStatus, setWhatsappStatus] = useState('')
  const [numeroConectado, setNumeroConectado] = useState('')
  const [nomeConectado, setNomeConectado] = useState('') */

  const [approvingId, setApprovingId] = useState<Id<'seletiva'> | null>(null)

  /*  const checkWhatsappStatus = async () => {
    try {
      const responseStatus = await axios.get('/api/whatsapp/status')
      setWhatsappStatus(responseStatus.data.message)

      if (responseStatus.data.message === 'session_connected') {
        const responseNumber = await axios.get('/api/whatsapp/getNumber')
        setNomeConectado(responseNumber.data.sessionInfo.pushname)
        setNumeroConectado(
          responseNumber.data.sessionInfo.me.user.slice(2, 4) +
            '9' +
            responseNumber.data.sessionInfo.me.user.slice(4),
        )
      }
    } catch (error) {
      console.error('Error checking whatsapp status:', error)
    }
  } */

  // Add useEffect to check status periodically
  /*   useEffect(() => {
    const interval = setInterval(checkWhatsappStatus, 5000)
    checkWhatsappStatus() // Initial check

    return () => clearInterval(interval)
  }, []) */

  const fetchSeletivaPaginated = async (offset: number, limit: number) => {
    setLoading(true)
    try {
      const seletivas = await fetchQuery(api.seletiva.getAllPaginated, {
        limit,
        offset,
      })

      const total = await fetchQuery(api.seletiva.getCount, {})
      setSeletivas(seletivas)
      setTotalCount(total)
    } catch (error) {
      console.error('Erro ao buscar seletivas paginadas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeletivaPaginated(offset, pageLimit)
  }, [offset, pageLimit])

  const handleNext = () => setOffset((prev) => prev + pageLimit)
  const handlePrev = () => setOffset((prev) => Math.max(prev - pageLimit, 0))

  /*  const removeCandidato = async (id: Id<'seletiva'>) => {
    setLoading(true)
    await fetchMutation(api.seletiva.remove, { seletivaId: id })
    fetchSeletivaPaginated(offset, limit)
    setLoading(false)
  } */

  const handleApproveAthlete = async (seletiva: Seletivas) => {
    setApprovingId(seletiva._id)
    try {
      // Update seletiva status
      await fetchMutation(api.seletiva.update, {
        id: seletiva._id,
        aprovado: true,
      })

      // Refresh list
      fetchSeletivaPaginated(offset, limit)
    } catch (error) {
      console.error('Erro ao aprovar atleta:', error)
    } finally {
      setApprovingId(null)
    }
  }

  const exportToPDF = async () => {
    const allSeletivas = await fetchQuery(api.seletiva.getAll, {})

    const sortedSeletivas = [...allSeletivas].sort((a, b) => {
      if (sortDirection === 'desc') {
        return a.nome.localeCompare(b.nome)
      }
      return b.nome.localeCompare(a.nome)
    })

    // eslint-disable-next-line new-cap
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    doc.setFontSize(16)
    doc.text('Lista Completa de Candidatos - Seletiva', 14, 15)

    const tableData = sortedSeletivas.map((seletiva) => [
      seletiva.nome,
      seletiva.email,
      formatPhoneNumber(seletiva.celular),
      seletiva.data_nascimento ? new Date(seletiva.data_nascimento).toLocaleDateString() : '-',
      `${seletiva.altura}m`,
      `${seletiva.peso}kg`,
      SETOR_LABELS[seletiva.setor as keyof typeof SETOR_LABELS],
      seletiva.posicao,
      seletiva.tem_experiencia ? 'Sim' : 'Não',
      seletiva.equipe_anterior || '-',
      EQUIPAMENTO_LABELS[seletiva.equipamento as keyof typeof EQUIPAMENTO_LABELS],
    ])

    // @ts-expect-error - Specific reason for expecting the error
    doc.autoTable({
      head: [
        [
          'Nome',
          'Email',
          'Celular',
          'Data Nasc.',
          'Altura',
          'Peso',
          'Setor',
          'Posição',
          'Experiência',
          'Equipe Anterior',
          'Equipamento',
        ],
      ],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 51, 102] },
      margin: { top: 25, right: 7, bottom: 7, left: 7 }, // Adicione esta linha
    })

    doc.save('lista-completa-seletiva.pdf')
  }
  // Adicione essa função para buscar os exercícios e tempos
  const loadExercicios = useCallback(async () => {
    const allExercicios = await fetchQuery(api.exercicios.getAll, {})
    setExercicios(allExercicios)
  }, [])

  useEffect(() => {
    loadExercicios()
  }, [loadExercicios])

  // Adicione esta função de ordenação
  const sortSeletivas = (data: Seletivas[]) => {
    return [...data].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.nome.localeCompare(b.nome)
      }
      return b.nome.localeCompare(a.nome)
    })
  }
  const sortPesoSeletivas = (data: Seletivas[]) => {
    return [...data].sort((a, b) => {
      if (pesoDirection === 'asc') {
        return a.peso - b.peso
      }
      return b.peso - a.peso
    })
  }
  const sortDataCadastroSeletivas = (data: Seletivas[]) => {
    return [...data].sort((a, b) => {
      if (dataCradastroDirection === 'asc') {
        return a._creationTime - b._creationTime
      }
      return b._creationTime - a._creationTime
    })
  }
  const sortAlturaSeletivas = (data: Seletivas[]) => {
    return [...data].sort((a, b) => {
      if (alturaDirection === 'asc') {
        return a.altura - b.altura
      }
      return b.altura - a.altura
    })
  }

  const sortCodSeletivaSeletivas = (data: Seletivas[]) => {
    return [...data].sort((a, b) => {
      const codA = a.cod_seletiva || ''
      const codB = b.cod_seletiva || ''
      if (codSeletivaDirection === 'asc') {
        return codA.localeCompare(codB)
      }
      return codB.localeCompare(codA)
    })
  }
  const formatarNome = (nome: string) => {
    // Remove acentuação e converte para maiúsculo
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
  }

  const handleTransferToAtleta = async (seletiva: Seletivas) => {
    console.log('Transferir atleta:', seletiva)

    try {
      await fetchMutation(api.atletas.create, {
        status: 1,
        nome: formatarNome(seletiva.nome),
        cpf: seletiva.cpf,
        email: seletiva.email,
        data_nascimento: seletiva.data_nascimento,
        data_registro: new Date().getTime(),
        altura: seletiva.altura,
        peso: seletiva.peso,
        celular: seletiva.celular,
        setor: 0,
        posicao: '',
        rua: '',
        bairro: '',
        cidade: '',
        cep: '',
        uf: '',
        complemento: '',
        genero: 'M',
        rg: '',
        emisor: '',
        uf_emisor: '',
        img_link: seletiva.img_link ? seletiva.img_link : '',
        img_key: seletiva.img_key ? seletiva.img_key : '',
      })

      await fetchMutation(api.seletiva.updatetransferido, {
        id: seletiva._id,
        transferido_atleta: true,
      })
      // Atualiza a lista
      fetchSeletivaPaginated(offset, limit)
    } catch (error) {
      console.error('Erro ao transferir para atletas:', error)
    }
  }

  const ImageCell = ({ imageUrl, className }: { imageUrl: string; className?: string }) => {
    const [error, setError] = useState(false)

    if (error || !imageUrl) {
      return (
        <Image
          src="/fallback-image.jpg" // Imagem padrão
          alt="Imagem padrão"
          className={className || 'w-12 h-12 rounded-full object-cover mx-auto'}
          width={className?.includes('w-64') ? 256 : 80}
          height={className?.includes('h-64') ? 256 : 80}
        />
      )
    }

    return (
      <Image
        src={imageUrl}
        alt="Foto do candidato"
        className={className || 'w-12 h-12 rounded-full object-cover mx-auto'}
        width={className?.includes('w-64') ? 256 : 80}
        height={className?.includes('h-64') ? 256 : 80}
        loading="eager"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <>
      <div
        className={cn(
          'space-y-8 w-screen pr-4 ',
          open ? 'md:max-w-[calc(100%-16rem)] ' : 'md:max-w-[calc(100%-5rem)] '
        )}
      >
        <div className="w-full overflow-auto">
          <div className="flex justify-between items-center  pr-4">
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  redirect('/dashboard/seletivaexercicios')
                }}
              >
                Adicionar Informações
              </Button>

              {/*  <Button
                onClick={() => {
                  redirect('/dashboard/seletivaimg')
                }}
              >
                Adicionar Foto
              </Button> */}
            </div>
          </div>
          <div className="w-full pr-4 pt-2">
            {/* Largura mínima para garantir que todas as colunas fiquem visíveis */}
            <ScrollArea className="h-[calc(80vh-220px)] w-full  rounded-md border   pr-2 ">
              <div className="">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      {/* <TableHead className="text-center w-16">Nº</TableHead> */}
                      <TableHead
                        className="text-center min-w-[150px] cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setCodSeletivaDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                          setSeletivas(sortCodSeletivaSeletivas(seletivas))
                        }}
                      >
                        Cod. Seletiva {codSeletivaDirection === 'asc' ? '↑' : '↓'}
                      </TableHead>
                      <TableHead className="text-center min-w-[100px]">Imagem</TableHead>
                      <TableHead
                        className="text-center min-w-[200px] cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                          setSeletivas(sortSeletivas(seletivas))
                        }}
                      >
                        Nome {sortDirection === 'asc' ? '↑' : '↓'}
                      </TableHead>
                      <TableHead className="text-center min-w-[200px]">Email</TableHead>
                      {exercicios.map((exercicio) => (
                        <TableHead className="text-center min-w-[200px]" key={exercicio._id}>
                          {exercicio.nome}
                        </TableHead>
                      ))}
                      <TableHead className="text-center w-32">Celular</TableHead>
                      <TableHead className="text-center w-28">Data Nasc.</TableHead>
                      <TableHead
                        className="text-center min-w-[200px] cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setAlturaDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                          setSeletivas(sortAlturaSeletivas(seletivas))
                        }}
                      >
                        Altura {alturaDirection === 'asc' ? '↑' : '↓'}
                      </TableHead>
                      <TableHead
                        className="text-center min-w-[200px] cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setPesoDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                          setSeletivas(sortPesoSeletivas(seletivas))
                        }}
                      >
                        Peso {pesoDirection === 'asc' ? '↑' : '↓'}
                      </TableHead>
                      <TableHead className="text-center w-32">Setor</TableHead>
                      <TableHead className="text-center w-28">Posição</TableHead>
                      <TableHead className="text-center w-28">Experiência</TableHead>
                      <TableHead className="text-center min-w-[150px]">Equipe Anterior</TableHead>
                      <TableHead className="text-center min-w-[150px]">Equipamento</TableHead>
                      <TableHead
                        className="text-center min-w-[200px] cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setDataCradastroDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                          setSeletivas(sortDataCadastroSeletivas(seletivas))
                        }}
                      >
                        Data Cadastro {dataCradastroDirection === 'asc' ? '↑' : '↓'}
                      </TableHead>

                      <TableHead className="text-center w-24">Opções</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center">
                          <Spinner />
                        </TableCell>
                      </TableRow>
                    ) : (
                      seletivas.map((seletiva) => (
                        <TableRow
                          key={seletiva._id}
                          className={cn(
                            seletiva.aprovado && 'bg-green-100',
                            seletiva.transferido_atleta && 'bg-blue-500',
                            'cursor-pointer hover:bg-muted/50'
                          )}
                        >
                          {/*  <TableCell className="text-center">
                          {seletiva.numerio_seletiva}
                        </TableCell> */}
                          <TableCell
                            className="text-center"
                            onClick={() => setSelectedSeletiva(seletiva)}
                          >
                            {seletiva.cod_seletiva || '-'}
                          </TableCell>
                          <TableCell
                            className="text-center"
                            onClick={() => setSelectedSeletiva(seletiva)}
                          >
                            {seletiva.img_link ? <ImageCell imageUrl={seletiva.img_link} /> : '-'}
                          </TableCell>
                          <TableCell
                            className="text-center  font-medium"
                            onClick={() => setSelectedSeletiva(seletiva)}
                          >
                            {seletiva.nome}
                          </TableCell>
                          <TableCell>{seletiva.email}</TableCell>
                          {exercicios.map((exercicio) => (
                            <TableCell className="text-center  font-medium" key={exercicio._id}>
                              <ExercicioTentativas
                                seletivaId={seletiva._id}
                                exercicioId={exercicio._id}
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center whitespace-nowrap">
                            {formatPhoneNumber(seletiva.celular)}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            {seletiva.data_nascimento
                              ? new Date(seletiva.data_nascimento).toLocaleDateString()
                              : '-'}
                          </TableCell>
                          <TableCell className="text-center">{seletiva.altura}m</TableCell>
                          <TableCell className="text-center">{seletiva.peso}kg</TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            {SETOR_LABELS[seletiva.setor as keyof typeof SETOR_LABELS]}
                          </TableCell>
                          <TableCell className="text-center">{seletiva.posicao}</TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            {seletiva.tem_experiencia ? 'Sim' : 'Não'}
                          </TableCell>
                          <TableCell className="text-center">
                            {seletiva.equipe_anterior || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {
                              EQUIPAMENTO_LABELS[
                                seletiva.equipamento as keyof typeof EQUIPAMENTO_LABELS
                              ]
                            }
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            {new Date(seletiva._creationTime).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-center justify-center gap-2">
                              {/*  <MessageButtons
                                recipient={{
                                  nome: seletiva.nome,
                                  email: seletiva.email,
                                  celular: seletiva.celular,
                                }}
                                whatsappStatus={whatsappStatus}
                                nomeConectado={nomeConectado}
                                numeroConectado={numeroConectado}
                                loading={loading}
                              /> */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveAthlete(seletiva)}
                                disabled={seletiva.aprovado || approvingId === seletiva._id}
                                className="w-full"
                              >
                                {approvingId === seletiva._id ? (
                                  <Spinner className="h-4 w-4" />
                                ) : seletiva.aprovado ? (
                                  'Aprovado'
                                ) : (
                                  'Aprovar'
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTransferToAtleta(seletiva)}
                                disabled={!seletiva.aprovado || seletiva.transferido_atleta}
                                className="w-full"
                              >
                                Transferir para Atletas
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4 pr-4">
          <div className="flex-1 text-sm text-muted-foreground">
            <p>
              Página {Math.ceil(offset / pageLimit) + 1} de {Math.ceil(totalCount / pageLimit)} |
              Total de registros: {totalCount}
            </p>
          </div>
          <Select
            value={pageLimit.toString()}
            onValueChange={(value) => {
              setPageLimit(Number(value))
              setOffset(0)
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="150">150</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={offset === 0 || loading}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={loading || seletivas.length < pageLimit}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {selectedSeletiva && (
        <Dialog open={!!selectedSeletiva} onOpenChange={() => setSelectedSeletiva(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Candidato</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {selectedSeletiva.img_link && (
                <div className="col-span-2 flex justify-center">
                  <ImageCell
                    imageUrl={selectedSeletiva.img_link}
                    className="w-64 h-64 rounded-lg object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold">Nome</h3>
                <p>{selectedSeletiva.nome}</p>
              </div>
              <div>
                <h3 className="font-semibold">Código Seletiva</h3>
                <p>{selectedSeletiva.cod_seletiva || '-'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>{selectedSeletiva.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Celular</h3>
                <p>{formatPhoneNumber(selectedSeletiva.celular)}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
