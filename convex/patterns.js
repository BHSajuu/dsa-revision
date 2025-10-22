import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPatternsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patterns")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const createPattern = mutation({
  args: {
    name: v.string(),
    userId: v.id("users"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("patterns", {
      name: args.name,
      userId: args.userId,
      order: args.order,
    });
  },
});

export const updatePattern = mutation({
  args: {
    patternId: v.id("patterns"),
    name: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { patternId, ...updates } = args;
    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.order !== undefined) updateData.order = updates.order;

    await ctx.db.patch(patternId, updateData);
  },
});

export const deletePattern = mutation({
  args: { patternId: v.id("patterns") },
  handler: async (ctx, args) => {
    const problems = await ctx.db
      .query("problems")
      .withIndex("by_pattern", (q) => q.eq("patternId", args.patternId))
      .collect();

    for (const problem of problems) {
      await ctx.db.delete(problem._id);
    }

    await ctx.db.delete(args.patternId);
  },
});