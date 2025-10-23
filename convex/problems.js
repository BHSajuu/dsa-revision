import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProblemsByPattern = query({
  args: { patternId: v.id("patterns") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("problems")
      .withIndex("by_pattern", (q) => q.eq("patternId", args.patternId))
      .collect();
  },
});

export const getProblemsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("problems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const createProblem = mutation({
  args: {
    patternId: v.id("patterns"),
    userId: v.id("users"),
    problemName: v.string(),
    leetcodeLink: v.string(),
    lastSolvedDate: v.optional(v.string()),
    nextReviewDate: v.optional(v.string()),
    successfulReviews: v.optional(v.number()),
    youtubeLink: v.optional(v.string()), 
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("problems", {
      patternId: args.patternId,
      userId: args.userId,
      problemName: args.problemName,
      leetcodeLink: args.leetcodeLink,
      lastSolvedDate: args.lastSolvedDate,
      nextReviewDate: args.nextReviewDate,
      successfulReviews: args.successfulReviews || 0,
      youtubeLink: args.youtubeLink,
      notes: args.notes,
    });
  },
});

export const updateProblem = mutation({
  args: {
    problemId: v.id("problems"),
    problemName: v.optional(v.string()),
    leetcodeLink: v.optional(v.string()),
    lastSolvedDate: v.optional(v.string()),
    nextReviewDate: v.optional(v.string()),
    successfulReviews: v.optional(v.number()),
    youtubeLink: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { problemId, ...updates } = args;
    const updateData = {};

    if (updates.problemName !== undefined) updateData.problemName = updates.problemName;
    if (updates.leetcodeLink !== undefined) updateData.leetcodeLink = updates.leetcodeLink;
    if (updates.lastSolvedDate !== undefined) updateData.lastSolvedDate = updates.lastSolvedDate;
    if (updates.nextReviewDate !== undefined) updateData.nextReviewDate = updates.nextReviewDate;
    if (updates.successfulReviews !== undefined) updateData.successfulReviews = updates.successfulReviews;
    if (updates.youtubeLink !== undefined) updateData.youtubeLink = updates.youtubeLink;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    await ctx.db.patch(problemId, updateData);
  },
});

export const deleteProblem = mutation({
  args: { problemId: v.id("problems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.problemId);
  },
});

export const incrementReviews = mutation({
  args: {
    problemId: v.id("problems"),
    lastSolvedDate: v.string(),
    nextReviewDate: v.string(),
  },
  handler: async (ctx, args) => {
    const problem = await ctx.db.get(args.problemId);
    if (!problem) throw new Error("Problem not found");

    await ctx.db.patch(args.problemId, {
      lastSolvedDate: args.lastSolvedDate,
      nextReviewDate: args.nextReviewDate,
      successfulReviews: problem.successfulReviews + 1,
    });
  },
});