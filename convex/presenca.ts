import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const salvarPresenca = mutation({
  args: {
    atleta_id: v.id("atletas"),
    data_treino: v.number(),
    presente: v.boolean(),
    observacao: v.string(),
  },
  handler: async ({ db }, { atleta_id, data_treino, presente, observacao }) => {
    // Verificar se já existe uma presença para este atleta nesta data
    const existingPresenca = await db
      .query("presenca")
      .withIndex("by_atleta_data", (q) =>
        q.eq("atleta_id", atleta_id).eq("data_treino", data_treino),
      )
      .unique();

    if (existingPresenca) {
      // Atualizar presença existente
      return await db.patch(existingPresenca._id, {
        presente,
        observacao,
      });
    } else {
      // Criar nova presença
      return await db.insert("presenca", {
        atleta_id,
        data_treino,
        presente,
        observacao,
        created_at: Date.now(),
      });
    }
  },
});

export const getPresencasByData = query({
  args: { data_treino: v.number() },
  handler: async (ctx, args) => {
    const presencas = await ctx.db
      .query("presenca")
      .filter((q) => q.eq(q.field("data_treino"), args.data_treino))
      .collect();
    return presencas;
  },
});

export const getUltimasPresencas = query({
  args: {},
  handler: async (ctx) => {
    // Busca as últimas 10 presenças ordenadas por data decrescente
    const presencas = await ctx.db
      .query("presenca")
      .filter((q) => q.eq(q.field("presente"), true))
      .order("desc")
      .take(10);

    // Pega os IDs únicos dos atletas
    const atletasIds = [...new Set(presencas.map((p) => p.atleta_id))];

    // Busca os dados dos atletas
    const atletas = await Promise.all(atletasIds.map((id) => ctx.db.get(id)));

    // Combina os dados de presença com os dados dos atletas
    return presencas.map((presenca) => ({
      ...presenca,
      atleta: atletas.find((a) => a?._id === presenca.atleta_id),
    }));
  },
});
