import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { linksSchema } from "./schema";

export const create = mutation({
  args: linksSchema,
  handler: async ({ db }, args) => {
    const links = await db.insert("links", args);
    return links;
  },
});
export const getlinksByTelaLinks = query({
  args: {
    telaLinksId: v.id("telaLinks"),
  },
  handler: async ({ db }, { telaLinksId }) => {
    const links = await db
      .query("links")
      .withIndex("by_telaLinks", (q) => q.eq("telaLinksId", telaLinksId))
      .collect();

    return links;
  },
});
