import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { pattern } from "framer-motion/client";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    leetcodeLink: v.optional(v.string()),
  }).index("by_email", ["email"]),

  patterns: defineTable({
    name: v.string(),
    userId: v.id("users"),
    order: v.number(),
    patternNotes: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  problems: defineTable({
    patternId: v.id("patterns"),
    userId: v.id("users"),
    problemName: v.string(),
    leetcodeLink: v.string(),
    lastSolvedDate: v.optional(v.string()),
    nextReviewDate: v.optional(v.string()),
    successfulReviews: v.number(),
    youtubeLink: v.optional(v.string()), 
    notes: v.optional(v.string()),  
  }).index("by_pattern", ["patternId"])
    .index("by_user", ["userId"]),
});