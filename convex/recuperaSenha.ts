import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { recuperaSenhaSchema } from "./schema";

export const create = mutation({
  args: recuperaSenhaSchema,
  handler: async ({ db }, args) => {
    const recuperaSenha = await db.insert("recuperaSenha", args);
    return recuperaSenha;
  },
});

export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const recuperaSenha = await db
      .query("recuperaSenha")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    return recuperaSenha;
  },
});

export const getById = query({
  args: {
    _id: v.id("recuperaSenha"),
  },
  handler: async ({ db }, { _id }) => {
    const recuperaSenha = await db
      .query("recuperaSenha")
      .withIndex("by_id", (q) => q.eq("_id", _id))
      .unique();
    return recuperaSenha;
  },
});

export const invalidaRecuperarSenha = mutation({
  args: {
    _id: v.id("recuperaSenha"),
  },
  handler: async ({ db }, { _id }) => {
    await db.patch(_id, {
      valid_at: Date.now(),
    });
  },
});
