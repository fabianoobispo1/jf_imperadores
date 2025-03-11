import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = query({
  args: { imageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.imageId);
    return imageUrl;
  },
});

export const removeFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});

export const deleteFile = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
    return true;
  },
});
