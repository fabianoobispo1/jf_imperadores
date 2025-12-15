# JF Imperadores - AI Coding Instructions

## Arquitetura do Projeto

Sistema de gestão para time de futebol americano construído com **Next.js 15** + **Convex** (backend real-time) + **NextAuth v5** (autenticação).

### Stack Principal
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS v4
- **Backend**: Convex (mutations/queries real-time)
- **Auth**: NextAuth v5 com Google/GitHub OAuth + credenciais
- **UI**: shadcn/ui (Radix UI) + Lucide icons
- **Forms**: React Hook Form + Zod validation
- **Email**: Resend + React Email templates
- **Storage**: MinIO para arquivos + Convex para metadados
- **Payments**: Stripe para mensalidades

## Estrutura de Diretórios

```
src/
  app/
    (dashboard)/          # Rotas protegidas com layout sidebar
      (administracao)/    # Área admin (role-based)
      dashboard/          # Módulos principais
    (public_routes)/      # Rotas públicas (entrar, seletiva)
    api/                  # Route handlers (send, stripe, whatsapp)
  auth/                   # NextAuth config
  components/
    forms/                # Formulários com validation
    ui/                   # shadcn components
  providers/              # Context providers (Auth, Convex)
  services/storage/       # Abstração MinIO
convex/                   # Backend schema + mutations/queries
```

## Padrões Críticos do Projeto

### 1. Convex Backend Pattern
**Mutations e Queries ficam em `convex/`**, não em API routes Next.js:

```typescript
// convex/user.ts
export const create = mutation({
  args: userSchema,
  handler: async ({ db }, args) => {
    return await db.insert('user', args)
  },
})

export const getByEmail = query({
  args: { email: v.string() },
  handler: async ({ db }, { email }) => {
    return await db.query('user')
      .withIndex('by_email', (q) => q.eq('email', email))
      .unique()
  },
})
```

**No client**: use `useMutation`/`useQuery` (React) ou `fetchMutation`/`fetchQuery` (Server Components):
```tsx
// Client Component
const create = useMutation(api.atletas.create)

// Server Component ou Server Action
const user = await fetchQuery(api.user.getByEmail, { email })
```

### 2. Autenticação e Autorização

**NextAuth v5** configurado em `src/auth/`:
- Providers: Google, GitHub, Credentials
- Callback customizado para criar usuários no Convex durante OAuth
- Role-based access: `admin` | `user` (definido no schema Convex)

**Proteção de rotas**:
```tsx
// Layout dashboard
const session = await auth()
if (!session?.user) redirect('/')

// Verificação admin
import { VerificaAdmin } from '@/components/VerificaAdmin'
// Cliente-side redirect se role !== 'admin'
```

### 3. Formulários com Validação
Padrão unificado: React Hook Form + Zod + shadcn Form components

```tsx
const formSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  // ...
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... }
})

// No submit, validar duplicatas com fetchQuery antes de mutation
```

### 4. Estrutura de Rotas

**Route Groups Next.js**:
- `(dashboard)`: Rotas protegidas, layout com `<AppSidebar>`
- `(public_routes)`: Login, seletiva pública, reset senha
- `(administracao)`: Subgrupo dashboard só para admins

**Naming**: arquivos `page.tsx` em lowercase (ex: `/dashboard/atletas/page.tsx`)

### 5. Componentes UI
Todos baseados em **shadcn/ui** (Radix UI primitives). Para adicionar componentes:
```bash
npx shadcn@latest add [component-name]
```

Customizações de tema em `tailwind.config.js` + CSS variables em `globals.css`.

### 6. Storage Pattern
Arquivos (imagens, PDFs) vão para **MinIO**, metadados no Convex:
- Abstraído em `src/services/storage/`
- Upload retorna `{ link, key }` → salvar ambos no Convex
- Imagens permitidas em `next.config.ts` `remotePatterns`

## Workflows Críticos

### Desenvolvimento
```bash
npm run dev              # Next.js dev server (porta 3000)
npx convex dev           # Convex backend sync (necessário rodar em paralelo)
```

**Importante**: ambos comandos devem rodar simultaneamente. Convex sincroniza schema automaticamente.

### Build/Deploy
```bash
npm run build            # Next.js build
npm start                # Production server
```

Requer variáveis de ambiente:
- `NEXT_PUBLIC_CONVEX_URL`
- `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GITHUB_ID`
- `RESEND_API_KEY` (email)
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, etc.

### Testando Funcionalidades
- **Seletiva**: rota pública `/seletiva` → cria candidato → admin aprova em `/dashboard/seletiva`
- **Mensalidades**: integração Stripe em `/dashboard/mensalidade-pagamento`
- **Emails**: templates React Email em `components/emailTemplates/`

## Convenções Específicas

### Nomeação
- Convex schemas: singular camelCase (`userSchema`, `atletasSchema`)
- Tabelas Convex: singular (`user`, `atletas`)
- Componentes: PascalCase (`AtletasList`, `VerificaAdmin`)
- Forms: sufixo `-form.tsx` (`atletas-form.tsx`)

### Dados
- Timestamps: sempre `Date.now()` (number), não `Date` objects
- IDs: tipo Convex `Id<"tableName">` (ex: `v.id('user')`)
- CPF/Phone: formatação em `lib/utils.ts` (`formatCPF`, `formatPhone`)

### Error Handling
- Forms: exibir erros com `toast` (sonner)
- Mutations: throw Error com mensagem PT-BR (ex: `throw new Error('Usuario não encontrado')`)

### Sidebar Navigation
Menu dinâmico em `app-sidebar.tsx`:
- Items base para todos usuários
- `itemsAdm` renderizado apenas se `role === 'admin'`
- Usa Collapsible para submenus

## Domínio do Negócio

Este é um sistema de gestão para time de **futebol americano**:
- **Atletas**: jogadores do time (cadastro completo)
- **Seletiva**: tryouts para novos candidatos → aprovados viram atletas
- **Exercícios**: testes físicos durante seletiva (40yd dash, bench press, etc.)
- **Mensalidades**: pagamentos mensais via Stripe
- **Presença**: controle de presença em treinos
- **Finanças**: gestão financeira do time

## Integrações Externas

- **Stripe**: pagamento mensalidades (webhooks em `/api/stripe`)
- **Resend**: envio emails transacionais
- **MinIO**: storage S3-compatible
- **WhatsApp API**: envio mensagens (rota `/api/whatsapp`)

## Troubleshooting Comum

1. **"Convex function not found"**: rodar `npx convex dev` para sincronizar schema
2. **Hydration errors**: garantir que dados server/client sejam consistentes (usar `suppressHydrationWarning` se necessário)
3. **Auth redirect loops**: verificar `pages.signIn` em `auth.config.ts` e proteção de rotas
4. **Imagens não carregam**: adicionar domínio em `next.config.ts` `remotePatterns`
