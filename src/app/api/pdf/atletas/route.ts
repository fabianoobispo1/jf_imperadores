import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../../convex/_generated/api'
import { formatCPF } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {


    // Buscar dados
    const atletas = await fetchQuery(api.atletas.getAllAtivos, {})

    // Ordenar por nome
    const sortedAtletas = [...atletas].sort((a, b) => a.nome.localeCompare(b.nome))

    // Criar PDF
    const doc = new PDFDocument({ margin: 50 })

    // Configurar cabeçalho
    doc.fontSize(16).text('Lista de Atletas Ativos', { align: 'center' })
    doc.moveDown()

    // Configurar tabela
    const tableTop = 150
    const colWidth = 250

    // Cabeçalho da tabela
    doc.fontSize(10).fillColor('#000000')
    doc.rect(50, tableTop - 20, colWidth, 20).fill('#E4E4E4')
    doc.rect(50 + colWidth, tableTop - 20, colWidth, 20).fill('#E4E4E4')

    doc
      .fillColor('#000000')
      .text('Nome', 50, tableTop - 15)
      .text('CPF', 50 + colWidth, tableTop - 15)

    // Linhas da tabela
    let y = tableTop
    sortedAtletas.forEach((atleta, i) => {
      // Alternar cores de fundo para facilitar leitura
      const fillColor = i % 2 === 0 ? '#FFFFFF' : '#F9F9F9'
      doc.rect(50, y, colWidth, 20).fill(fillColor)
      doc.rect(50 + colWidth, y, colWidth, 20).fill(fillColor)

      doc
        .fillColor('#000000')
        .fontSize(8)
        .text(atleta.nome.toUpperCase(), 55, y + 5)
        .text(formatCPF(atleta.cpf), 55 + colWidth, y + 5)

      y += 20

      // Nova página se necessário
      if (y > 700) {
        doc.addPage()
        y = 50
      }
    })

    // Finalizar PDF
    const chunks: Buffer[] = []

    return new Promise<NextResponse>((resolve) => {
      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        const response = new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=lista_atletas.pdf',
          },
        })
        resolve(response)
      })

      doc.end()
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return new NextResponse(JSON.stringify({ error: 'Erro ao gerar PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
