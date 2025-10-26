import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { predefinedPatterns } from "./predefined";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    leetcodeLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      leetcodeLink: args.leetcodeLink || "",
    });

    // Add predefined patterns and their problems for the new user
    for (let i = 0; i < predefinedPatterns.length; i++) {
      const patternData = predefinedPatterns[i];
      // Create the pattern first to get its ID
      const patternId = await ctx.db.insert("patterns", {
        name: patternData.name,
        userId: userId,
        order: i,
        patternNotes: patternData.patternNotes,
      });

      // Now, add the problems associated with this pattern
      if (patternData.problems) {
        for (const problem of patternData.problems) {
          await ctx.db.insert("problems", {
            ...problem, // Spreads problemName and leetcodeLink
            patternId: patternId,
            userId: userId,
            successfulReviews: 0,
          });
        }
      }
    }

    return userId;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    leetcodeLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.leetcodeLink !== undefined) updateData.leetcodeLink = updates.leetcodeLink;

    await ctx.db.patch(userId, updateData);
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});