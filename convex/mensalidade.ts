import { v } from 'convex/values'

import { query, mutation } from './_generated/server'
import { mensalidadeSchema } from './schema'

export const create = mutation({
  args: mensalidadeSchema,
  handler: async ({ db }, args) => {
    const mensalidade = await db.insert('mensalidade', args)
    return mensalidade
  },
})

export const getAll = query({
  handler: async (ctx) => {
    const mensalidades = await ctx.db.query('mensalidade').order('desc').collect()

    // Get athlete data for each mensalidade
    const mensalidadesWithAtleta = await Promise.all(
      mensalidades.map(async (mensalidade) => {
        const atleta = await ctx.db
          .query('atletas')
          .filter((q) => q.eq(q.field('email'), mensalidade.email))
          .first()

        return {
          ...mensalidade,
          nome: atleta?.nome || 'Não encontrado',
        }
      })
    )

    return mensalidadesWithAtleta
  },
})

export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const mensalidade = await db
      .query('mensalidade')
      .withIndex('by_email', (q) => q.eq('email', email))
      .unique()
    return mensalidade
  },
})

export const getById = query({
  args: {
    mensalidadeId: v.id('mensalidade'),
  },
  handler: async ({ db }, { mensalidadeId }) => {
    const mensalidade = await db
      .query('mensalidade')
      .withIndex('by_id', (q) => q.eq('_id', mensalidadeId))
      .unique()
    return mensalidade
  },
})

export const updateCancelamento = mutation({
  args: {
    id_payment_stripe: v.string(),
    cancelado: v.boolean(),
    data_cancelamento: v.number(),
  },
  handler: async (ctx, args) => {
    const mensalidade = await ctx.db
      .query('mensalidade')
      .filter((q) => q.eq(q.field('id_payment_stripe'), args.id_payment_stripe))
      .first()

    if (!mensalidade) {
      throw new Error('Mensalidade não encontrada')
    }

    await ctx.db.patch(mensalidade._id, {
      cancelado: args.cancelado,
      data_cancelamento: args.data_cancelamento,
    })

    return mensalidade
  },
})

export const getByEmailAndDateRange = query({
  args: {
    email: v.string(),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async ({ db }, { email, startDate, endDate }) => {
    const mensalidade = await db
      .query('mensalidade')
      .filter((q) =>
        q.and(
          q.eq(q.field('email'), email),
          q.gte(q.field('data_pagamento'), startDate),
          q.lte(q.field('data_pagamento'), endDate)
        )
      )
      .first()

    return mensalidade
  },
})
export const getAllByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const mensalidades = await db
      .query('mensalidade')
      .withIndex('by_email', (q) => q.eq('email', email))
      .collect()
    return mensalidades
  },
})
