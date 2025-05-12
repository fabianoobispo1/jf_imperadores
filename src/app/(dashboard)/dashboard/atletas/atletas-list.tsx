'use-client'
import { Suspense, useEffect, useState } from 'react'
import { PenBoxIcon, Trash, FileDown, Copy } from 'lucide-react'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { useSession } from 'next-auth/react'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { cn, formatCPF, formatPhoneNumber } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import type { Id } from '../../../../../convex/_generated/dataModel'
import { api } from '../../../../../convex/_generated/api'
import { AtletasForm } from '../../../../components/forms/atletas-form'

import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AtletasPDFDownload } from '@/components/pdf/AtletasPDF'

const SETOR_LABELS = {
  1: 'Ataque',
  2: 'Defesa',
  3: 'Special Teams',
  4: 'Sem preferência',
} as const

/* const STATUS_LABELS = {
  1: 'Ativo',
  2: 'Inativo',
  3: 'Pendente',
} as const */

interface Atletas {
  _id: Id<'atletas'>
  _creationTime: number
  status: number
  nome: string
  cpf: string
  data_nascimento?: number | undefined
  email: string
  altura?: number // Make optional
  peso?: number // Make optional
  celular: string
  setor: number
  posicao: string
  rua: string
  bairro: string
  cidade: string
  cep: string
  uf: string
  complemento: string
  data_registro?: number | undefined
  genero: string
  rg: string
  emisor: string
  uf_emisor: string
  img_link: string
}

export const AtletasList = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [atletas, setAtletas] = useState<Atletas[]>([])
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 100
  const { open } = useSidebar()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAtleta, setSelectedAtleta] = useState<Atletas | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [carregou, setiscarregou] = useState(false)
  const [exibeBotaoCopiar, setExibeBotaoCopiar] = useState(true)
  if (session) {
    /*     console.log(session) */

    if (!carregou) {
      if (session.user.role === 'admin') {
        setIsAdmin(true)
      }
      setiscarregou(true)
    }
  }

  const fetchAtletasPaginated = async (offset: number, limit: number) => {
    setLoading(true)
    try {
      const atletas = await fetchQuery(api.atletas.getAllPaginated, {
        limit,
        offset,
        status: 1,
      })
      const total = await fetchQuery(api.atletas.getCountByStatus, {
        status: 1,
      })

      setAtletas(atletas)
      setTotalCount(total)
    } catch (error) {
      console.error('Erro ao buscar atletas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAtletasPaginated(offset, limit)
  }, [offset])

  const handleNext = () => setOffset((prev) => prev + limit)
  const handlePrev = () => setOffset((prev) => Math.max(prev - limit, 0))

  const removeAtleta = async (id: Id<'atletas'>) => {
    setLoading(true)
    await fetchMutation(api.atletas.updateStatus, {
      atletaId: id,
      status: 2, // Set status to inactive (2)
    })
    fetchAtletasPaginated(offset, limit)
    setLoading(false)
  }

  const [pdfData, setPdfData] = useState<{ nome: string; cpf: string }[] | null>(null)
  const [loadingPDF, setLoadingPDF] = useState(false)

  const preparePDFData = async () => {
    setLoadingPDF(true)
    try {
      // Usar try/catch para cada operação de rede
      let activeAtletas
      try {
        activeAtletas = await fetchQuery(api.atletas.getAllAtivos, {})
      } catch (error) {
        console.error('Erro ao buscar atletas ativos:', error)
        throw new Error('Falha ao buscar dados dos atletas')
      }

      // Ordenar por nome

      const sortedAtletas = [...activeAtletas].sort((a, b) => a.nome.localeCompare(b.nome))

      // Mapear apenas os campos necessários para o PDF (reduzir tamanho dos dados)
      const formattedData = sortedAtletas.map((atleta) => ({
        nome: atleta.nome,

        cpf: atleta.cpf,
      }))

      // Verificar se há dados antes de prosseguir
      if (formattedData.length === 0) {
        toast.warning('Sem dados', {
          description: 'Não há atletas ativos para gerar o PDF',
          duration: 3000,
        })
        return
      }

      setPdfData(formattedData)
    } catch (error) {
      console.error('Erro ao preparar dados para PDF:', error)
      toast.error('Erro ao preparar PDF', {
        description: 'Ocorreu um erro ao preparar os dados para o PDF.',
        duration: 3000,
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Ok', {
          description: 'Copiado para a área de transferência!',
          duration: 3000,
          richColors: true,
        })
      })
      .catch((err) => {
        console.error('Erro ao copiar: ', err)
      })
  }

  const toggleCopyButtons = () => {
    setExibeBotaoCopiar((prev) => !prev)
  }

  return (
    <div
      className={cn(
        'space-y-4 w-screen pr-2 ',
        open ? 'md:max-w-[calc(100%-18rem)] ' : 'md:max-w-[calc(100%-7rem)] '
      )}
    >
      <div className="flex justify-between items-center gap-2 w-full overflow-auto pr-4">
        <Button disabled={!isAdmin} onClick={() => setIsAddModalOpen(true)}>
          Adicionar Atleta
        </Button>

        <div className="flex items-center space-x-2">
          <Switch id="copy-mode" checked={exibeBotaoCopiar} onCheckedChange={toggleCopyButtons} />
          <Label htmlFor="copy-mode">Exibir botões de cópia</Label>
        </div>

        {pdfData ? (
          <div className="flex gap-2">
            <Suspense
              fallback={
                <Button variant="outline" disabled>
                  Carregando PDF...
                </Button>
              }
            >
              <AtletasPDFDownload atletas={pdfData} />
            </Suspense>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPdfData(null)}
              title="Cancelar geração de PDF"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={preparePDFData} disabled={loadingPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            {loadingPDF ? 'Preparando...' : 'PDF Ativos'}
          </Button>
        )}
      </div>
      <div className="w-full overflow-auto">
        <div className="w-full pr-4">
          {/* Largura mínima para garantir que todas as colunas fiquem visíveis */}
          <ScrollArea className="h-[calc(80vh-220px)] w-full  rounded-md border pr-2">
            <Table>
              <TableHeader className="sticky top-0 bg-background ">
                <TableRow>
                  {/* <TableHead className="text-center">Status</TableHead> */}
                  <TableHead className="text-center min-w-[300px]">Nome</TableHead>
                  <TableHead className="text-center min-w-[150px]">Data Nascimento</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center min-w-[150px]">Celular</TableHead>
                  <TableHead className="text-center min-w-[150px]">CPF</TableHead>
                  <TableHead className="text-center">Altura</TableHead>
                  <TableHead className="text-center">Peso</TableHead>

                  <TableHead className="text-center">Setor</TableHead>
                  <TableHead className="text-center">Posição</TableHead>
                  <TableHead className="text-center min-w-[300px]">Rua</TableHead>
                  <TableHead className="text-center min-w-[200px]">Bairro</TableHead>
                  <TableHead className="text-center min-w-[200px]">Cidade</TableHead>
                  <TableHead className="text-center min-w-[100px]">CEP</TableHead>
                  <TableHead className="text-center">UF</TableHead>
                  <TableHead className="text-center">Complemento</TableHead>

                  {/*         <TableHead className="text-center">Gênero</TableHead> */}
                  <TableHead className="text-center">RG</TableHead>
                  <TableHead className="text-center">Emissor</TableHead>
                  <TableHead className="text-center">UF Emissor</TableHead>
                  <TableHead className="text-center min-w-[150px]">Data Registro</TableHead>
                  {/* <TableHead className="text-center">Imagem</TableHead> */}
                  <TableHead className="text-center min-w-[300px]">Nome</TableHead>
                  <TableHead className="text-center">Opções</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      <Spinner />
                    </TableCell>
                  </TableRow>
                ) : (
                  atletas.map((atleta) => (
                    <TableRow key={atleta._id}>
                      {/*  <TableCell>
                        {
                          STATUS_LABELS[
                            atleta.status as keyof typeof STATUS_LABELS
                          ]
                        }
                      </TableCell> */}
                      <TableCell>
                        {atleta.nome}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.nome)}
                            title="Copiar nome"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-center">
                        {atleta.data_nascimento
                          ? new Date(atleta.data_nascimento).toLocaleDateString()
                          : '-'}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              copyToClipboard(
                                atleta.data_nascimento
                                  ? new Date(atleta.data_nascimento).toLocaleDateString()
                                  : '-'
                              )
                            }
                            title="Copiar data de nascimento"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {atleta.email}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.email)}
                            title="Copiar email"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-center">
                        {atleta.celular === '' ? '-' : formatPhoneNumber(atleta.celular)}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.celular)}
                            title="Copiar celular"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCPF(atleta.cpf)}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.cpf)}
                            title="Copiar cpf"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>{atleta.altura}m</TableCell>
                      <TableCell>{atleta.peso}kg</TableCell>
                      <TableCell>
                        {SETOR_LABELS[atleta.setor as keyof typeof SETOR_LABELS]}
                      </TableCell>
                      <TableCell>{atleta.posicao}</TableCell>
                      <TableCell>
                        {atleta.rua}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.rua)}
                            title="Copiar rua"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-center">
                        {atleta.bairro}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.bairro)}
                            title="Copiar bairro"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-center">
                        {atleta.cidade}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.cidade)}
                            title="Copiar cidade"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {atleta.cep}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.cep)}
                            title="Copiar cep"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {atleta.uf}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.uf)}
                            title="Copiar uf"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {atleta.complemento}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.complemento)}
                            title="Copiar complemento"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      {/*  <TableCell>{atleta.genero}</TableCell> */}
                      <TableCell>
                        {atleta.rg}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.rg)}
                            title="Copiar rg"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {atleta.emisor}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.emisor)}
                            title="Copiar emisor"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {atleta.uf_emisor}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.uf_emisor)}
                            title="Copiar uf_emisor"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      {/*        <TableCell>{atleta.img_link}</TableCell> */}
                      <TableCell className="text-center">
                        {atleta.data_registro
                          ? new Date(atleta.data_registro).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {atleta.nome}
                        {exibeBotaoCopiar ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(atleta.nome)}
                            title="Copiar nome"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {/*  <LoadingButton loading={loading} disabled>
                          <PenBoxIcon className="h-4 w-4" />
                        </LoadingButton> */}
                        <div className="flex justify-center text-center gap-1">
                          <Button
                            disabled={!isAdmin}
                            onClick={() => {
                              setSelectedAtleta(atleta)
                              setIsModalOpen(true)
                            }}
                          >
                            <PenBoxIcon className="h-4 w-4" />
                          </Button>

                          {/*   <Button
                            variant={'destructive'}
                            onClick={() => removeAtleta(atleta._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button> */}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button disabled={!isAdmin} variant="destructive">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação ira desativar o atleta.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeAtleta(atleta._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Desativar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4 pr-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            Página {Math.ceil(offset / limit) + 1} de {Math.ceil(totalCount / limit)} | Total de
            registros: {totalCount}
          </p>
        </div>
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
            disabled={loading || atletas.length < limit}
          >
            Próxima
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[900px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Editar Atleta</DialogTitle>
          </DialogHeader>
          <AtletasForm
            initialData={selectedAtleta}
            onSuccess={() => {
              setIsModalOpen(false)
              fetchAtletasPaginated(offset, limit)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-[900px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Atleta</DialogTitle>
          </DialogHeader>
          <AtletasForm
            onSuccess={() => {
              setIsAddModalOpen(false)
              fetchAtletasPaginated(offset, limit)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} /* 
Alternativa: Usar react-pdf
Se o problema persistir, uma alternativa mais compatível com Next.js é usar a biblioteca @react-pdf/renderer:

npm install @react-pdf/renderer

Copy
Execute

E então criar um componente separado para o PDF:

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { formatCPF } from '@/lib/utils';

// Definir estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#003366',
    color: '#FFFFFF',
  },
  tableCell: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 8,
  },
  headerCell: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

// Componente PDF
const AtletasPDF = ({ atletas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Lista Completa de Atletas Ativos e Aprovados</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerCell]}>Nome</Text>
          <Text style={[styles.tableCell, styles.headerCell]}>CPF</Text>
        </View>
        {atletas.map((atleta, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}>{atleta.nome.toUpperCase()}</Text>
            <Text style={styles.tableCell}>{formatCPF(atleta.cpf)}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Componente para download
export const AtletasPDFDownload = ({ atletas }) => (
  <PDFDownloadLink 
    document={<AtletasPDF atletas={atletas} />} 
    fileName="lista_completa.pdf"
    style={{
      textDecoration: 'none',
      padding: '8px 16px',
      backgroundColor: '#f0f0f0',
      color: '#333',
      borderRadius: '4px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    }}
  >
    {({ blob, url, loading, error }) => 
      loading ? 'Gerando PDF...' : 'Baixar PDF'
    }
  </PDFDownloadLink>
);

Copy


src\components\AtletasPDF.tsx
E então no seu componente principal:

import { useState, useEffect, lazy, Suspense } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Importação dinâmica do componente PDF
const AtletasPDFDownload = lazy(() => import('@/components/AtletasPDF').then(mod => ({ default: mod.AtletasPDFDownload })));

// No seu componente
const [pdfData, setPdfData] = useState(null);
const [loadingPDF, setLoadingPDF] = useState(false);

const preparePDFData = async () => {
  setLoadingPDF(true);
  try {
    const activeAtletas = await fetchQuery(api.atletas.getAllAtivos, {});
    const approvedSeletivas = await fetchQuery(api.seletiva.getAllApproved, {});

    const allPeople = [...activeAtletas, ...approvedSeletivas]
      .sort((a, b) => a.nome.localeCompare(b.nome));
    
    setPdfData(allPeople);
  } catch (error) {
    console.error('Erro ao preparar dados para PDF:', error);
    toast.error('Erro ao preparar PDF', {
      description: 'Ocorreu um erro ao preparar os dados para o PDF.',
      duration: 3000,
    });
  } finally {
    setLoadingPDF(false);
  }
};

// No JSX
{pdfData ? (
  <Suspense fallback={<Button disabled>Carregando PDF...</Button>}>
    <AtletasPDFDownload atletas={pdfData} />
  </Suspense>
) : (
  <Button 
    variant="outline" 
    onClick={preparePDFData} 
    disabled={loadingPDF}
  >
    <FileDown className="mr-2 h-4 w-4" />
    {loadingPDF ? 'Preparando...' : 'PDF Ativos e aprovados'}
  </Button>
)}

Copy


src\app(dashboard)\dashboard\atletas\atletas-list.tsx
Esta abordagem com @react-pdf/renderer é mais compatível com Next.js e deve evitar os problemas que você está enfrentando na Vercel. */
