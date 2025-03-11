import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Buscar todos exercícios
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("exercicios").collect();
  },
});

// Criar exercício
export const create = mutation({
  args: {
    nome: v.string(),
    descricao: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exercicios", {
      nome: args.nome,
      descricao: args.descricao,
      status: true,
    });
  },
});
// buscar exercicio pelo id
export const getExercicioById = query({
  args: {
    id: v.id("exercicios"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Registrar tentativa
export const registrarTentativa = mutation({
  args: {
    seletiva_id: v.id("seletiva"),
    exercicio_id: v.id("exercicios"),
    tentativa: v.number(),
    tempo: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exercicios_tentativas", {
      seletiva_id: args.seletiva_id,
      exercicio_id: args.exercicio_id,
      tentativa: args.tentativa,
      tempo: args.tempo,
      data_registro: Date.now(),
    });
  },
});

// Buscar tentativas por seletiva
export const getTentativasBySeletiva = query({
  args: {
    seletiva_id: v.id("seletiva"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exercicios_tentativas")
      .filter((q) => q.eq(q.field("seletiva_id"), args.seletiva_id))
      .collect();
  },
});

export const getTentativasBySeletivaExercicio = query({
  args: {
    seletiva_id: v.id("seletiva"),
    exercicio_id: v.id("exercicios"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exercicios_tentativas")
      .filter((q) =>
        q.and(
          q.eq(q.field("seletiva_id"), args.seletiva_id),
          q.eq(q.field("exercicio_id"), args.exercicio_id),
        ),
      )
      .collect();
  },
});
export const removeTentativa = mutation({
  args: {
    tentativaId: v.id("exercicios_tentativas"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.tentativaId);
  },
});
export const getAllTentativas = query({
  handler: async (ctx) => {
    const tentativas = await ctx.db.query("exercicios_tentativas").collect();

    // Busca informações do atleta para cada tentativa
    const tentativasComNome = await Promise.all(
      tentativas.map(async (tentativa) => {
        const atleta = await ctx.db.get(tentativa.seletiva_id);
        return {
          ...tentativa,
          atleta_nome: atleta?.nome || "Atleta não encontrado",
        };
      }),
    );

    return tentativasComNome.sort((a, b) => b.data_registro - a.data_registro);
  },
});
