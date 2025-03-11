import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { telaLinksSchema } from "./schema";

export const create = mutation({
  args: telaLinksSchema,
  handler: async ({ db }, args) => {
    const telaLinks = await db.insert("telaLinks", args);
    return telaLinks;
  },
});

// this query will get the podcast by the authorId.
export const getTelaLinksByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const telaLinks = await ctx.db
      .query("telaLinks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return { telaLinks };
  },
});

// this query will get the podcast by the authorId.
export const getTelaLinksByName = query({
  args: {
    nome: v.string(),
  },
  handler: async (ctx, args) => {
    const telaLinks = await ctx.db
      .query("telaLinks")
      .filter((q) => q.eq(q.field("nome"), args.nome))
      .collect();

    return { telaLinks };
  },
});

export const updateTelaLinks = mutation({
  args: {
    id: v.id("telaLinks"), // ID do registro a ser atualizado
    nome: v.string(), // Novo valor para o campo `nome`
    bio: v.string(), // Novo valor para o campo `bio`
  },
  handler: async ({ db }, { id, nome, bio }) => {
    // Atualiza o documento pelo ID
    await db.patch(id, {
      nome,
      bio,
      updated_at: Date.now(), // Atualiza o timestamp para o momento atual
    });

    // Retorna uma mensagem de sucesso ou o documento atualizado, se necessário
    return { success: true };
  },
});

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const updateIMGTelaLinks = mutation({
  args: {
    id: v.id("telaLinks"), // ID do registro a ser atualizado
    linkImagem: v.string(),
  },
  handler: async ({ db }, { id, linkImagem }) => {
    // Atualiza o documento pelo ID
    await db.patch(id, {
      linkImagem,
      updated_at: Date.now(), // Atualiza o timestamp para o momento atual
    });

    // Retorna uma mensagem de sucesso ou o documento atualizado, se necessário
    return { success: true };
  },
});
