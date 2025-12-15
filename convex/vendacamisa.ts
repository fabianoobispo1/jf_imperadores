import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Criar nova venda (sem timestamps)
export const getAll = query({
  handler: async ({ db }) => {
    const vendas = await db.query('vendacamisa').collect()
    return vendas
  },
})

// Listar com paginação
export const getAllPaginated = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.optional(v.string()),
    }),
  },
  handler: async ({ db }, args) => {
    const vendas = await db
      .query('vendacamisa')
      .paginate({
        numItems: args.paginationOpts.numItems,
        cursor: args.paginationOpts.cursor || null,
      })
    return vendas
  },
})

// Buscar por ID
export const getById = query({
  args: {
    id: v.id('vendacamisa'),
  },
  handler: async ({ db }, { id }) => {
    return await db.get(id)
  },
})

// Buscar por nome
export const getByNome = query({
  args: {
    nome: v.string(),
  },
  handler: async ({ db }, { nome }) => {
    return await db
      .query('vendacamisa')
      .withIndex('by_nome', (q) => q.eq('nome', nome))
      .collect()
  },
})

// Criar nova venda
export const create = mutation({
  args: {
    nome: v.string(),
    numero: v.string(),
    tamanho: v.string(),
  },
  handler: async ({ db }, args) => {
    const id = await db.insert('vendacamisa', {
      ...args,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    return id
  },
})

// Atualizar venda
export const update = mutation({
  args: {
    id: v.id('vendacamisa'),
    nome: v.optional(v.string()),
    numero: v.optional(v.string()),
    tamanho: v.optional(v.string()),
  },
  handler: async ({ db }, { id, nome, numero, tamanho }) => {
    const venda = await db.get(id)
    if (!venda) {
      throw new Error('Venda não encontrada')
    }

    await db.patch(id, {
      ...(nome && { nome }),
      ...(numero && { numero }),
      ...(tamanho && { tamanho }),
      updated_at: Date.now(),
    })

    return await db.get(id)
  },
})

// Deletar venda
export const remove = mutation({
  args: {
    id: v.id('vendacamisa'),
  },
  handler: async ({ db }, { id }) => {
    const venda = await db.get(id)
    if (!venda) {
      throw new Error('Venda não encontrada')
    }
    await db.delete(id)
    return venda
  },
})
