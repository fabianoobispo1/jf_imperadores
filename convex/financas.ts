import { v } from "convex/values";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

import { mutation, query } from "./_generated/server";
import { financasSchema } from "./schema";

export const create = mutation({
  args: financasSchema,
  handler: async (ctx, args) => {
    return await ctx.db.insert("financas", {
      ...args,
      status: args.status as "pendente" | "confirmado",
      tipo: args.tipo as "despesa" | "receita",
      categoria: args.categoria as
        | "equipamento"
        | "mensalidade"
        | "viagem"
        | "patrocinio"
        | "evento"
        | "outros",
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    financaId: v.id("financas"),
  },

  handler: async ({ db }, { financaId }) => {
    // Buscar o todo para garantir que ele existe antes de remover
    const financa = await db.get(financaId);
    if (!financa) {
      throw new Error("financa não encontrado");
    }

    // Remover o financa do banco de dados
    await db.delete(financaId);

    return { success: true, message: "registro removido com sucesso" }; // Resposta de confirmação
  },
});

export const getBalancoMensal = query({
  handler: async (ctx) => {
    const transacoes = await ctx.db
      .query("financas")
      .filter((q) => q.and(q.eq(q.field("status"), "confirmado")))
      .collect();

    return {
      receitas: transacoes
        .filter((t) => t.tipo === "receita")
        .reduce((acc, t) => acc + t.valor, 0),
      despesas: transacoes
        .filter((t) => t.tipo === "despesa")
        .reduce((acc, t) => acc + t.valor, 0),
    };
  },
});

export const getTransacoes = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("financas");

    if (args.startDate && args.endDate) {
      query = query.filter((q) =>
        q.and(
          q.gte(q.field("data"), args.startDate!),
          q.lte(q.field("data"), args.endDate!),
        ),
      );
    }

    return await query.order("desc").collect();
  },
});

export const getTransacoesPorCategoria = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Busca todas as transações do período
    let transacoes = await ctx.db
      .query("financas")

      .collect();

    // Aplica filtro de data se fornecido
    if (args.startDate && args.endDate) {
      transacoes = transacoes.filter(
        (t) => t.data >= args.startDate! && t.data <= args.endDate!,
      );
    }

    // Agrupa por categoria e calcula totais
    const categorias = transacoes.reduce(
      (acc, transacao) => {
        const categoria = transacao.categoria;
        if (!acc[categoria]) {
          acc[categoria] = {
            nome: categoria,
            total: 0,
            quantidade: 0,
          };
        }

        // Soma todos os valores, independente do tipo
        acc[categoria].total += transacao.valor;
        acc[categoria].quantidade++;

        return acc;
      },
      {} as Record<string, { nome: string; total: number; quantidade: number }>,
    );

    return {
      categorias: Object.values(categorias).sort((a, b) => b.total - a.total),
      total: transacoes.length,
    };
  },
});

export const getHistoricoMensal = query({
  args: {
    meses: v.optional(v.number()), // número de meses para buscar
  },
  handler: async (ctx, args) => {
    // Define período padrão de 6 meses se não especificado
    const numeroMeses = args.meses || 6;

    // Data atual
    const hoje = new Date();

    // Array para armazenar resultados mensais
    const historicoMensal = [];

    // Busca todas as transações do período
    const transacoes = await ctx.db.query("financas").collect();

    // Processa os últimos N meses
    for (let i = 0; i < numeroMeses; i++) {
      const dataReferencia = subMonths(hoje, i);
      const inicioMes = startOfMonth(dataReferencia).getTime();
      const fimMes = endOfMonth(dataReferencia).getTime();

      // Filtra transações do mês
      const transacoesMes = transacoes.filter(
        (t) => t.data >= inicioMes && t.data <= fimMes,
      );

      // Calcula totais do mês
      const receitas = transacoesMes
        .filter((t) => t.tipo === "receita")
        .reduce((acc, t) => acc + t.valor, 0);

      const despesas = transacoesMes
        .filter((t) => t.tipo === "despesa")
        .reduce((acc, t) => acc + t.valor, 0);

      historicoMensal.push({
        mes: inicioMes,
        receitas,
        despesas,
        saldo: receitas - despesas,
      });
    }

    // Retorna ordenado do mais antigo para o mais recente
    return historicoMensal.reverse();
  },
});

export const getById = query({
  args: {
    id: v.id("financas"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const transacao = await ctx.db.get(args.id);

    // Verifica se existe e pertence ao usuário
    if (!transacao || transacao.userId !== args.userId) {
      return null;
    }

    return transacao;
  },
});

export const update = mutation({
  args: {
    id: v.id("financas"),
    userId: v.string(),
    tipo: v.string(),
    descricao: v.string(),
    valor: v.number(),
    data: v.number(),
    categoria: v.string(),
    status: v.string(),
    comprovante_url: v.optional(v.string()),
    comprovante_key: v.optional(v.string()),
    observacao: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, userId, ...updates } = args;

    // Verifica se a transação existe e pertence ao usuário
    const existingTransaction = await ctx.db.get(id);
    if (!existingTransaction || existingTransaction.userId !== userId) {
      throw new Error("Transação não encontrada ou sem permissão");
    }

    // Atualiza a transação
    return await ctx.db.patch(id, {
      ...updates,
      tipo: updates.tipo as "despesa" | "receita",
      status: updates.status as "pendente" | "confirmado",
      categoria: updates.categoria as
        | "equipamento"
        | "mensalidade"
        | "viagem"
        | "patrocinio"
        | "evento"
        | "outros",
      updated_at: Date.now(),
    });
  },
});
