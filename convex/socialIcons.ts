import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import { socialIconsSchema } from "./schema";

export const create = mutation({
  args: socialIconsSchema,
  handler: async ({ db }, args) => {
    const socialIcons = await db.insert("socialIcons", args);
    return socialIcons;
  },
});
export const getsocialIconsByTelaLinks = query({
  args: {
    telaLinksId: v.id("telaLinks"),
  },
  handler: async ({ db }, { telaLinksId }) => {
    const socialIcons = await db
      .query("socialIcons")
      .withIndex("by_telaLinks", (q) => q.eq("telaLinksId", telaLinksId))
      .collect();

    return socialIcons;
  },
});
