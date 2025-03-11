import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { seletivaSchema } from "./schema";

export const create = mutation({
  args: seletivaSchema,
  handler: async ({ db }, args) => {
    const seletivaUser = await db.insert("seletiva", args);
    return seletivaUser;
  },
});

export const getAllPaginated = query({
  args: {
    offset: v.number(),
    limit: v.number(),
  },
  handler: async ({ db }, { offset, limit }) => {
    // Obtemos todos os documentos e os manipulamos manualmente
    const allSeletivas = await db
      .query("seletiva") // Consulta a tabela 'seletiva'
      .order("desc") // Ordena em ordem decrescente
      .collect(); // Retorna todos os resultados como uma lista

    // Retornamos somente o intervalo desejado
    return allSeletivas.slice(offset, offset + limit);
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const seletivas = await ctx.db.query("seletiva").order("desc").collect();

    return seletivas;
  },
});

export const getByNome = query({
  args: {
    nome: v.string(),
  },
  handler: async ({ db }, { nome }) => {
    const seletiva = await db
      .query("seletiva")
      .withIndex("by_nome", (q) => q.eq("nome", nome))
      .unique();
    return seletiva;
  },
});

export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const user = await db
      .query("seletiva")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    return user;
  },
});

export const remove = mutation({
  args: {
    seletivaId: v.id("seletiva"), // ID do seletiva a ser removido
  },
  handler: async ({ db }, { seletivaId }) => {
    // Buscar o seletiva para garantir que ele existe antes de remover
    const seletiva = await db.get(seletivaId);
    if (!seletiva) {
      throw new Error("seletiva não encontrado");
    }

    // Remover o seletiva do banco de dados
    await db.delete(seletivaId);

    return { success: true, message: "seletiva removido com sucesso" }; // Resposta de confirmação
  },
});

export const getCount = query({
  handler: async (ctx) => {
    const count = await ctx.db.query("seletiva").collect();
    return count.length;
  },
});

export const update = mutation({
  args: {
    id: v.id("seletiva"),
    aprovado: v.boolean(),
  },
  handler: async ({ db }, { id, aprovado }) => {
    await db.patch(id, {
      aprovado,
    });

    return { success: true };
  },
});

export const updatetransferido = mutation({
  args: {
    id: v.id("seletiva"),
    transferido_atleta: v.boolean(),
  },
  handler: async ({ db }, { id, transferido_atleta }) => {
    await db.patch(id, {
      transferido_atleta,
    });

    return { success: true };
  },
});

export const updateImg = mutation({
  args: {
    id: v.id("seletiva"),
    img_link: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, img_link } = args;

    return await ctx.db.patch(id, {
      img_link,
    });
  },
});

export const updateCodSeletiva = mutation({
  args: {
    id: v.id("seletiva"),
    cod_seletiva: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { cod_seletiva: args.cod_seletiva });
  },
});

export const getByCodSeletiva = query({
  args: { cod_seletiva: v.string() },
  handler: async (ctx, args) => {
    const seletiva = await ctx.db
      .query("seletiva")
      .filter((q) => q.eq(q.field("cod_seletiva"), args.cod_seletiva))
      .first();
    return seletiva;
  },
});

export const getCountByAprovados = query({
  handler: async (ctx) => {
    const aprovados = await ctx.db
      .query("seletiva")
      .filter((q) =>
        q.and(
          q.eq(q.field("aprovado"), true),
          q.or(
            q.eq(q.field("transferido_atleta"), false),
            q.eq(q.field("transferido_atleta"), undefined),
          ),
        ),
      )
      .collect();

    return aprovados.length;
  },
});

export const getAllApproved = query({
  handler: async (ctx) => {
    const seletivas = await ctx.db
      .query("seletiva")
      .filter((q) => q.eq(q.field("aprovado"), true))
      .collect();

    return seletivas;
  },
});
