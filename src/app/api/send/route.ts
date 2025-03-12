import { Resend } from 'resend'

import ConfirmacaoSeletiva from '@/components/emailTemplates/email-confirmacao-seletiva'
import Seletiva from '@/components/emailTemplates/email-seletiva'
import Livre from '@/components/emailTemplates/email-livre'

import { ResetPasswordEmail } from '../../../components/emailTemplates/email-reset-password'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, idRecuperaSenha, nome, tipoMensagem, conteudo, assunto } = await request.json()
  if (tipoMensagem === 'redefinirSenha') {
    try {
      const { data, error } = await resend.emails.send({
        from: 'JF Imperadores <nao-responda@marketing.jfimperadores.com.br>',
        to: [email],
        subject: 'Recupar senha',
        react: ResetPasswordEmail({
          nome,
          idReset: idRecuperaSenha,
        }),
      })

      if (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 })
      }

      return Response.json(data)
    } catch (error) {
      return Response.json({ error }, { status: 500 })
    }
  }

  if (tipoMensagem === 'confirmaSeletiva') {
    try {
      const { data, error } = await resend.emails.send({
        from: 'JF Imperadores <nao-responda@marketing.jfimperadores.com.br>',
        to: [email],
        subject: 'Confirmação da seletiva',
        react: ConfirmacaoSeletiva({
          nome,
        }),
      })

      if (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 })
      }

      return Response.json(data)
    } catch (error) {
      return Response.json({ error }, { status: 500 })
    }
  }

  if (tipoMensagem === 'seletiva') {
    try {
      const { data, error } = await resend.emails.send({
        from: 'JF Imperadores <nao-responda@marketing.jfimperadores.com.br>',
        to: [email],
        subject: 'JF Imperadores - Seletiva',
        react: Seletiva({
          conteudo,
        }),
      })
      if (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 })
      }

      return Response.json(data)
    } catch (error) {
      return Response.json({ error }, { status: 500 })
    }
  }
  if (tipoMensagem === 'livre') {
    try {
      const { data, error } = await resend.emails.send({
        from: 'JF Imperadores <nao-responda@marketing.jfimperadores.com.br>',
        to: [email],
        subject: assunto,
        react: Livre({
          conteudo,
        }),
      })
      if (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 })
      }

      return Response.json(data)
    } catch (error) {
      return Response.json({ error }, { status: 500 })
    }
  }
}
