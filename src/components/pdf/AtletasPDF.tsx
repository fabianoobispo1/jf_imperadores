import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer'
import { formatCPF } from '@/lib/utils'

// Registrar fontes (opcional, mas melhora a aparência)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
})

// Definir estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
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
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
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
      <Text style={styles.title}>Lista Completa de Atletas Ativos</Text>
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
      <Text style={styles.footer}>Imperadores Football - {new Date().toLocaleDateString()}</Text>
    </Page>
  </Document>
)

// Componente para download
export const AtletasPDFDownload = ({ atletas }: { atletas: AtletaPDF[] }) => (
  <PDFDownloadLink
    document={<AtletasPDFDocument atletas={atletas} />}
    fileName="lista_atletas.pdf"
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
    {({ blob, url, loading, error }) => (loading ? 'Gerando PDF...' : 'Baixar PDF')}
  </PDFDownloadLink>
)
