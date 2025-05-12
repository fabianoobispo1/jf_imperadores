import React from 'react'
import { Document, Page, Text, View, StyleSheet, BlobProvider, Font } from '@react-pdf/renderer'
import { formatCPF } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'

// Registrar fontes de CDNs confiáveis
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf',
  fontWeight: 'normal',
})

// Estilos simplificados para melhor compatibilidade
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#E4E4E4',
  },
  tableCell: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 8,
  },
  headerCell: {
    fontWeight: 'bold',
  },
})

// Interface para os dados dos atletas
interface AtletaPDF {
  nome: string
  cpf: string
}

// Componente PDF
const AtletasPDFDocument = ({ atletas }: { atletas: AtletaPDF[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Lista de Atletas Ativos</Text>
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
)

// Componente para download usando BlobProvider (mais compatível com dispositivos móveis)
export const AtletasPDFDownload = ({ atletas }: { atletas: AtletaPDF[] }) => (
  <BlobProvider document={<AtletasPDFDocument atletas={atletas} />}>
    {({ blob, url, loading, error }) => {
      if (loading) return <Button disabled>Gerando PDF...</Button>
      if (error) return <Button variant="destructive">Erro ao gerar PDF</Button>
      
      return (
        <Button 
          variant="outline" 
          onClick={() => {
            // Criar um link temporário para download
            const link = document.createElement('a')
            link.href = url as string
            link.download = 'lista_atletas.pdf'
            link.click()
          }}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      )
    }}
  </BlobProvider>
)
