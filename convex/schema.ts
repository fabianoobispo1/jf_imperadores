import { v } from 'convex/values'
import { defineSchema, defineTable } from 'convex/server'

// Schema para usuários
export const userSchema = {
  nome: v.string(),
  email: v.string(),
  provider: v.string(),
  role: v.union(v.literal('admin'), v.literal('user')),
  image: v.optional(v.string()),
  image_key: v.optional(v.string()),
  password: v.string(),
  data_nascimento: v.optional(v.number()),
  cpf: v.optional(v.string()),
  last_login: v.optional(v.number()),
}

export const recuperaSenhaSchema = {
  email: v.string(),
  created_at: v.number(),
  valid_at: v.number(),
}

// Schema para todos
export const todoSchema = {
  text: v.string(),
  isCompleted: v.boolean(),
  created_at: v.number(),
  updated_at: v.number(),
  userId: v.id('user'),
}

// Schema para telaLinks
export const telaLinksSchema = {
  nome: v.string(),
  bio: v.string(),
  linkImagem: v.string(),
  background: v.string(),
  created_at: v.number(),
  updated_at: v.number(),
  userId: v.id('user'),
}

export const socialIconsSchema = {
  nome: v.string(),
  link: v.string(),
  icon: v.string(),
  created_at: v.number(),
  updated_at: v.number(),
  telaLinksId: v.id('telaLinks'), // Referência à tabela 'telaLinks'
}

export const linksSchema = {
  nome: v.string(),
  link: v.string(),
  created_at: v.number(),
  updated_at: v.number(),
  telaLinksId: v.id('telaLinks'),
}

export const seletivaSchema = {
  numerio_seletiva: v.number(),
  nome: v.string(),
  cpf: v.string(),
  data_nascimento: v.optional(v.number()),
  email: v.string(),
  altura: v.number(),
  peso: v.number(),
  celular: v.string(),
  tem_experiencia: v.boolean(),
  equipe_anterior: v.string(),
  setor: v.number(),
  posicao: v.string(),
  equipamento: v.number(),
  img_link: v.string(),
  img_key: v.optional(v.string()),
  aprovado: v.optional(v.boolean()),
  cod_seletiva: v.optional(v.string()),
  transferido_atleta: v.optional(v.boolean()),
}

export const atletasSchema = {
  status: v.number(),
  nome: v.string(),
  cpf: v.string(),
  data_nascimento: v.optional(v.number()),
  data_registro: v.optional(v.number()),
  email: v.string(),
  altura: v.optional(v.number()),
  peso: v.optional(v.number()),
  celular: v.string(),
  setor: v.number(),
  posicao: v.string(),
  rua: v.string(),
  bairro: v.string(),
  cidade: v.string(),
  cep: v.string(),
  uf: v.string(),
  complemento: v.string(),
  genero: v.string(),
  rg: v.string(),
  emisor: v.string(),
  uf_emisor: v.string(),
  img_link: v.string(),
  img_key: v.optional(v.string()),
}

export const transacaoSchema = {
  tipo: v.union(v.literal('despesa'), v.literal('receita')),
  descricao: v.string(),
  valor: v.number(),
  data: v.number(),
}

export const mensalidadeSchema = {
  tipo: v.union(v.literal('avulsa'), v.literal('recorrente')),
  email: v.string(),
  customer: v.string(),
  id_payment_stripe: v.string(),
  valor: v.number(),
  data_pagamento: v.number(),
  mes_referencia: v.string(),
  data_cancelamento: v.number(),
  cancelado: v.boolean(),
}
export const financasSchema = {
  tipo: v.union(v.literal('receita'), v.literal('despesa')),
  descricao: v.string(),
  valor: v.number(),
  data: v.number(),
  categoria: v.union(
    v.literal('mensalidade'),
    v.literal('equipamento'),
    v.literal('viagem'),
    v.literal('patrocinio'),
    v.literal('evento'),
    v.literal('outros')
  ),
  comprovante_url: v.optional(v.string()),
  comprovante_key: v.optional(v.string()),
  status: v.union(v.literal('pendente'), v.literal('confirmado')),
  observacao: v.optional(v.string()),
  created_at: v.number(),
  updated_at: v.number(),
  userId: v.id('user'),
}
export const seletivaConfigSchema = {
  titulo: v.string(),
  descricao: v.string(),
  data_inicio: v.number(), // timestamp
  data_fim: v.number(), // timestamp
  local: v.string(),
  horario: v.string(),
  status: v.boolean(), // ativa/inativa
  created_at: v.number(),
}

export const exerciciosSchema = {
  nome: v.string(),
  descricao: v.string(),
  status: v.boolean(),
}

// Tabela de tentativas dos exercícios
export const exercicios_tentativasSchema = {
  seletiva_id: v.id('seletiva'),
  exercicio_id: v.id('exercicios'),
  tentativa: v.number(), // 1, 2 ou 3
  tempo: v.number(), // tempo em segundos
  data_registro: v.number(), // timestamp
}

export const presencaSchema = {
  atleta_id: v.id('atletas'),
  data_treino: v.number(), // timestamp do treino
  presente: v.boolean(),
  observacao: v.optional(v.string()),
  created_at: v.number(),
}

export const vendacamisaSchema = {
  nome: v.string(),
  numero: v.string(),
  tamanho: v.string(),
  created_at: v.number(),
  updated_at: v.number(),
}

// Definição do Schema completo
export default defineSchema({
  user: defineTable(userSchema).index('by_email', ['email']).index('by_username', ['nome']),
  recuperaSenha: defineTable(recuperaSenhaSchema).index('by_email', ['email']),
  todo: defineTable(todoSchema).index('by_user', ['userId']), // Índice para buscar todos de um usuário
  telaLinks: defineTable(telaLinksSchema)
    .index('by_nome', ['nome'])
    .index('by_user', ['userId'])
    .searchIndex('search_by_user', { searchField: 'userId' }),
  socialIcons: defineTable(socialIconsSchema).index('by_telaLinks', ['telaLinksId']),
  links: defineTable(linksSchema).index('by_telaLinks', ['telaLinksId']),
  seletiva: defineTable(seletivaSchema).index('by_nome', ['nome']).index('by_email', ['email']),
  atletas: defineTable(atletasSchema)
    .index('by_nome', ['nome'])
    .index('by_email', ['email'])
    .index('by_cpf', ['cpf'])
    .index('by_status', ['status']),
  transacao: defineTable(transacaoSchema).index('by_data', ['data']),
  mensalidade: defineTable(mensalidadeSchema)
    .index('by_data_pagamento', ['data_pagamento'])
    .index('by_email', ['email']),
  financas: defineTable(financasSchema).index('by_data', ['data']),
  seletivaConfig: defineTable(seletivaConfigSchema).index('by_status', ['status']),
  exercicios: defineTable(exerciciosSchema).index('by_nome', ['nome']),
  exercicios_tentativas: defineTable(exercicios_tentativasSchema).index('by_seletiva_id', [
    'seletiva_id',
  ]),
  presenca: defineTable(presencaSchema)
    .index('by_data_treino', ['data_treino'])
    .index('by_atleta_id', ['atleta_id'])
    .index('by_atleta_data', ['atleta_id', 'data_treino']),
  vendacamisa: defineTable(vendacamisaSchema).index('by_nome', ['nome']),
})
