import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Img,
} from '@react-email/components'
import * as React from 'react'

interface ResetPasswordEmailProps {
  nome?: string
  idReset?: string
}

const baseUrl = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : ''

export const ResetPasswordEmail = ({
  nome,
  idReset,
}: ResetPasswordEmailProps) => {
  const linkReset = baseUrl + '/reset/' + idReset
  return (
    <Html>
      <Head />
      <Preview>Você atualizou a senha da sua conta no jf imperadores.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width={114}
              src={`https://utfs.io/f/dwPWeUvGjeshHo1rdSsunfACXgk6ZQGdOI1qiWVabsTy9Mvc`}
            />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Oi {nome},</Text>
            <Text style={paragraph}>
              Recentemente houve uma solicitação para alterar a senha da sua
              conta.
            </Text>
            <Text style={paragraph}>
              Clique no link para confirmar esta alteração:{' '}
              <Link href={linkReset} style={link}>
                nova senha
              </Link>
            </Text>
            <Text style={paragraph}>
              Se você não pediu a redefinição de sua senha, é provável que outro
              usuário tenha digitado seu nome de usuário ou endereço de e-mail
              por engano ao tentar redefinir a própria senha. Se esse for o
              caso, você não precisa tomar nenhuma medida adicional e pode
              ignorar este e-mail com segurança.
            </Text>

            <Text style={paragraph}>
              Obrigado,
              <br />
              Jf Imperadores
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          {/* <Row>
            <Column align="right" style={{ width: '50%', paddingRight: '8px' }}>
              <Img src={`${baseUrl}/static/twitch-icon-twitter.png`} />
            </Column>
            <Column align="left" style={{ width: '50%', paddingLeft: '8px' }}>
              <Img src={`${baseUrl}/static/twitch-icon-facebook.png`} />
            </Column>
          </Row> */}
          <Row>
            <Text style={{ textAlign: 'center', color: '#706a7b' }}>
              © 2024 Bispo, Todos os direitos reservados.
              <br />
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  )
}

ResetPasswordEmail.PreviewProps = {
  nome: 'alanturing',
  idReset: '12345',
} as ResetPasswordEmailProps

export default ResetPasswordEmail

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif'

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
}

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
}

const container = {
  maxWidth: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
}

const footer = {
  maxWidth: '580px',
  margin: '0 auto',
}

const content = {
  padding: '5px 20px 10px 20px',
}

const logo = {
  display: 'flex',
  justifyContent: 'center',
  alingItems: 'center',
  padding: 30,
}

const sectionsBorders = {
  width: '100%',
  display: 'flex',
}

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
}

const sectionCenter = {
  borderBottom: '1px solid rgb(150, 112, 8)',
  width: '102px',
}

const link = {
  textDecoration: 'underline',
}
