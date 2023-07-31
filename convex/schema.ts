import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // this is UserJSON from @clerk/backend
    clerkUser: v.object({
      id: v.string(),
      email: v.string(),
      name: v.string(),
    }),
  }).index("by_user_id", ["clerkUser.id"]),

  sessions: defineTable({
    // this is SessionJSON from @clerk/backend
    clerkSession: v.object({
      id: v.string(),
      user_id: v.string(),
      status: v.string(),
      created_at: v.number(),
      last_active_at: v.number(),
      expire_at: v.number(),
    }),
  })
    .index("by_user_id", ["clerkSession.user_id"])
    .index("by_session_id", ["clerkSession.id"]),
});
