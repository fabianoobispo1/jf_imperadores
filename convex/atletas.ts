import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { atletasSchema } from "./schema";

export const create = mutation({
  args: atletasSchema,
  handler: async ({ db }, args) => {
    const atletasUser = await db.insert("atletas", args);
    return atletasUser;
  },
});

export const getAllPaginated = query({
  args: {
    offset: v.number(),
    limit: v.number(),
    status: v.number(),
  },
  handler: async ({ db }, { offset, limit, status }) => {
    const allatletass = await db
      .query("atletas")
      .withIndex("by_nome")
      .filter((q) => q.eq(q.field("status"), status))
      .order("asc")
      .collect();

    return allatletass.slice(offset, offset + limit);
  },
});

export const getByNome = query({
  args: {
    nome: v.string(),
  },
  handler: async ({ db }, { nome }) => {
    const atletas = await db
      .query("atletas")
      .withIndex("by_nome", (q) => q.eq("nome", nome))
      .unique();
    return atletas;
  },
});

export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const user = await db
      .query("atletas")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    return user;
  },
});

export const remove = mutation({
  args: {
    atletasId: v.id("atletas"), // ID do atletas a ser removido
  },
  handler: async ({ db }, { atletasId }) => {
    // Buscar o atletas para garantir que ele existe antes de remover
    const atletas = await db.get(atletasId);
    if (!atletas) {
      throw new Error("atletas não encontrado");
    }

    // Remover o atletas do banco de dados
    await db.delete(atletasId);

    return { success: true, message: "atletas removido com sucesso" }; // Resposta de confirmação
  },
});

export const getCount = query({
  handler: async (ctx) => {
    const count = await ctx.db.query("atletas").collect();
    return count.length;
  },
});

export const update = mutation({
  args: {
    atletaId: v.id("atletas"),
    status: v.optional(v.number()),
    nome: v.optional(v.string()),
    cpf: v.optional(v.string()),
    data_nascimento: v.optional(v.optional(v.number())),
    data_registro: v.optional(v.optional(v.number())),
    email: v.optional(v.string()),
    altura: v.optional(v.optional(v.number())),
    peso: v.optional(v.optional(v.number())),
    celular: v.optional(v.string()),
    setor: v.optional(v.number()),
    posicao: v.optional(v.string()),
    rua: v.optional(v.string()),
    bairro: v.optional(v.string()),
    cidade: v.optional(v.string()),
    cep: v.optional(v.string()),
    uf: v.optional(v.string()),
    complemento: v.optional(v.string()),
    genero: v.optional(v.string()),
    rg: v.optional(v.string()),
    emisor: v.optional(v.string()),
    uf_emisor: v.optional(v.string()),
    img_link: v.optional(v.string()),
  },
  handler: async (
    { db },
    {
      atletaId,
      status,
      nome,
      cpf,
      data_nascimento,
      data_registro,
      email,
      altura,
      peso,
      celular,
      setor,
      posicao,
      rua,
      bairro,
      cidade,
      cep,
      uf,
      complemento,
      genero,
      rg,
      emisor,
      uf_emisor,
      img_link,
    },
  ) => {
    // Buscar o atleta atual
    const atleta = await db.get(atletaId);
    if (!atleta) {
      throw new Error("atleta não encontrado");
    }
    // altera os valores
    const updateUser = await db.patch(atletaId, {
      status,
      nome,
      cpf,
      data_nascimento,
      data_registro,
      email,
      altura,
      peso,
      celular,
      setor,
      posicao,
      rua,
      bairro,
      cidade,
      cep,
      uf,
      complemento,
      genero,
      rg,
      emisor,
      uf_emisor,
      img_link,
    });

    return updateUser;
  },
});

export const getCountByStatus = query({
  args: {
    status: v.number(),
  },
  handler: async (ctx, { status }) => {
    const atletas = await ctx.db
      .query("atletas")
      .filter((q) => q.eq(q.field("status"), status))
      .collect();
    return atletas.length;
  },
});

export const updateStatus = mutation({
  args: {
    atletaId: v.id("atletas"),
    status: v.number(),
  },
  handler: async (ctx, { atletaId, status }) => {
    const atleta = await ctx.db.patch(atletaId, {
      status,
    });
    return atleta;
  },
});

export const getAllAtivos = query({
  args: {},
  handler: async (ctx) => {
    const atletas = await ctx.db
      .query("atletas")
      .filter((q) => q.eq(q.field("status"), 1))
      .collect();

    return atletas.map((atleta) => ({
      id: atleta._id,
      email: atleta.email,
      celular: atleta.celular,
      nome: atleta.nome,
      cpf: atleta.cpf,
    }));
  },
});
