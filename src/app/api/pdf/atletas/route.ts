import { NextRequest, NextResponse } from 'next/server'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../../convex/_generated/api'
import { formatCPF } from '@/lib/utils'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Adicione esta declaração para estender o tipo jsPDF com o método autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function GET(req: NextRequest) {
  try {
    // Buscar dados
    const atletas = await fetchQuery(api.atletas.getAllAtivos, {})

    // Ordenar por nome
    const sortedAtletas = [...atletas].sort((a, b) => a.nome.localeCompare(b.nome))

    // Preparar dados para a tabela
    const tableData = sortedAtletas.map((atleta) => [
      atleta.nome.toUpperCase(),
      formatCPF(atleta.cpf),
    ])

    // Criar PDF com jsPDF
    const doc = new jsPDF()

    // Adicionar título
    doc.setFontSize(16)
    doc.text('Lista de Atletas Ativos', doc.internal.pageSize.getWidth() / 2, 20, {
      align: 'center',
    })

    // Adicionar tabela usando autoTable
    doc.autoTable({
      head: [['Nome', 'CPF']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [228, 228, 228], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      margin: { top: 30 },
    })

    // Converter para buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Retornar resposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=lista_atletas.pdf',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return new NextResponse(JSON.stringify({ error: 'Erro ao gerar PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
