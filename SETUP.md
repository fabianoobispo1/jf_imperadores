# Guia de Setup do JF Imperadores

## Pré-requisitos

- Node.js 20.x
- npm ou yarn
- Git

## Instalação

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd jf_imperadores
npm install
```

2. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha as variáveis necessárias (veja detalhes abaixo).

## Configuração das Integrações

### Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Vá para "Credenciais" > "Criar credencial" > "ID do cliente OAuth"
4. Configure como "Aplicação Web"
5. Adicione a URI de redirecionamento autorizada:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://seu-dominio.com/api/auth/callback/google`
6. Copie `Client ID` e `Client Secret` para `.env.local`

### GitHub OAuth

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Configure:
   - Application name: JF Imperadores
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copie `Client ID` e `Client Secret` para `.env.local`

### Resend (Email Service)

1. Acesse [Resend](https://resend.com/)
2. Crie uma conta e obtenha sua API Key
3. Adicione ao `.env.local` como `RESEND_API_KEY`

### Stripe (Payment Gateway)

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Obtenha as chaves de test/live
3. Adicione `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ao `.env.local`

### MinIO (File Storage)

1. Configure um servidor MinIO ou use um serviço S3-compatível
2. Obtenha endpoint, access key e secret key
3. Adicione ao `.env.local`:
   ```
   MINIO_ENDPOINT=seu-endpoint.com
   MINIO_BUCKET=seu-bucket
   MINIO_ACCESS_KEY=sua-access-key
   MINIO_SECRET_KEY=sua-secret-key
   ```

## Desenvolvimento

### Iniciar o servidor de desenvolvimento

Você precisa rodar **dois comandos em paralelo**:

**Terminal 1 - Next.js dev server:**
```bash
npm run dev
```

**Terminal 2 - Convex dev server:**
```bash
npx convex dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build para produção

```bash
npm run build
npm start
```

## Troubleshooting

### "Missing required parameter: client_id"

Solução: Adicione `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` ao `.env.local`

### "Convex function not found"

Solução: Certifique-se de que `npx convex dev` está rodando em um terminal separado

### Erro de build com pdfjs-dist

Já foi corrigido na configuração webpack do `next.config.ts`

## Estrutura do Projeto

```
src/
  app/              # Rotas Next.js (App Router)
  auth/             # Configuração NextAuth
  components/       # Componentes React reutilizáveis
  providers/        # Context providers (Auth, Convex)
  services/         # Serviços (storage, etc)
  types/            # Type definitions

convex/
  *.ts              # Mutations e queries (backend)
  schema.ts         # Schema do banco de dados
```

## Documentação Adicional

- [Next.js Docs](https://nextjs.org)
- [Convex Docs](https://docs.convex.dev)
- [NextAuth.js Docs](https://next-auth.js.org)
- [shadcn/ui](https://ui.shadcn.com)

## Suporte

Para dúvidas ou problemas, consulte o arquivo `.github/copilot-instructions.md` para informações sobre arquitetura e padrões do projeto.
