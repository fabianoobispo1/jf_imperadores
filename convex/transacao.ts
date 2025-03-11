import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { transacaoSchema } from "./schema";

export const create = mutation({
  args: transacaoSchema,
  handler: async ({ db }, args) => {
    const transacao = await db.insert("transacao", args);
    return transacao;
  },
});

export const remove = mutation({
  args: {
    transacaoId: v.id("transacao"),
  },
  handler: async ({ db }, { transacaoId }) => {
    const transacao = await db.get(transacaoId);
    if (!transacao) {
      throw new Error("Todo não encontrado");
    }

    await db.delete(transacaoId);

    return { success: true, message: "Todo removido com sucesso" };
  },
});

export const buscaPeriodo = query({
  args: {
    dataInicial: v.number(),
    dataFinal: v.number(),
  },
  handler: async ({ db }, { dataInicial, dataFinal }) => {
    if (dataInicial >= dataFinal) {
      throw new Error("A data inicial deve ser menor que a data final.");
    }

    const transacoes = await db
      .query("transacao")
      .filter((q) =>
        q.and(
          q.gte(q.field("data"), dataInicial),
          q.lt(q.field("data"), dataFinal),
        ),
      )
      .collect();

    return transacoes;
  },
});
