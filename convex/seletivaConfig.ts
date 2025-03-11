import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Query para buscar todas as configurações de seletivas
export const getAllConfig = query({
  handler: async (ctx) => {
    const seletivas = await ctx.db
      .query("seletivaConfig")
      .order("desc")
      .collect();
    return seletivas;
  },
});

// Mutation para criar nova configuração de seletiva
export const createConfig = mutation({
  args: {
    titulo: v.string(),
    descricao: v.string(),
    data_inicio: v.number(),
    data_fim: v.number(),
    local: v.string(),
    horario: v.string(),
    status: v.boolean(),
    created_at: v.number(),
  },
  handler: async (ctx, args) => {
    const newSeletiva = await ctx.db.insert("seletivaConfig", {
      titulo: args.titulo,
      descricao: args.descricao,
      data_inicio: args.data_inicio,
      data_fim: args.data_fim,
      local: args.local,
      horario: args.horario,
      status: args.status,
      created_at: args.created_at,
    });
    return newSeletiva;
  },
});

export const updateConfig = mutation({
  args: {
    id: v.id("seletivaConfig"),
    titulo: v.string(),
    descricao: v.string(),
    data_inicio: v.number(),
    data_fim: v.number(),
    local: v.string(),
    horario: v.string(),
    status: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});
