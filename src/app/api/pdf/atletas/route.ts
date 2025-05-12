import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../../convex/_generated/api'

export async function GET() {
  try {
    // Buscar dados dos atletas
    const atletas = await fetchQuery(api.atletas.getAllAtivos, {})

    // Ordenar por nome
    const sortedAtletas = [...atletas].sort((a, b) => a.nome.localeCompare(b.nome))

    // Criar um novo documento PDF
    const doc = new jsPDF()

    // Configurar o documento
    doc.setFontSize(18)
    doc.text('Lista de Atletas - JF Imperadores', 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 190, 30, {
      align: 'right',
    })

    // Cabeçalho da tabela
    const startX = 20
    let startY = 40

    doc.setFontSize(12)
    doc.text('Nome', startX, startY)
    doc.text('CPF', startX + 120, startY)

    doc.line(startX, startY + 2, startX + 170, startY + 2)

    startY += 10

    // Conteúdo da tabela
    doc.setFontSize(10)

    sortedAtletas.forEach((atleta, index) => {
      // Verificar se precisa de uma nova página
      if (startY > 280) {
        doc.addPage()
        startY = 20

        // Adicionar cabeçalho na nova página
        doc.setFontSize(12)
        doc.text('Nome', startX, startY)
        doc.text('CPF', startX + 120, startY)
        doc.line(startX, startY + 2, startX + 170, startY + 2)

        startY += 10
        doc.setFontSize(10)
      }

      // Formatar CPF
      const formatCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      }

      doc.text(atleta.nome, startX, startY)
      doc.text(formatCPF(atleta.cpf), startX + 120, startY)

      startY += 8

      // Adicionar linha divisória entre registros
      if (index < sortedAtletas.length - 1) {
        doc.setDrawColor(200, 200, 200)
        doc.line(startX, startY - 4, startX + 170, startY - 4)
      }
    })

    // Adicionar rodapé
    doc.setFontSize(8)
    doc.text('JF Imperadores - Documento gerado automaticamente', 105, 290, { align: 'center' })

    // Obter o PDF como array buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Retornar o PDF como resposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=lista_atletas.pdf',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      {
        error: 'Erro ao gerar PDF',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
