import { User, Session } from "@clerk/clerk-sdk-node";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertUser = mutation({
  args: {
    user: v.object({
      id: v.string(),
      email: v.string(),
      name: v.string(),
    }),
  },

  handler: async (ctx, args) => {
    const { user: clerkUser } = args;

    console.log(`upserting user ${clerkUser.id}`);
    const userRecord = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("clerkUser.id", clerkUser.id))
      .unique();

    if (userRecord === null) {
      await ctx.db.insert("users", { clerkUser });
    } else {
      await ctx.db.patch(userRecord._id, { clerkUser });
    }
  },
});

export const upsertSession = mutation({
  args: {
    session: v.object({
      id: v.string(),
      user_id: v.string(),
      status: v.string(),
      created_at: v.number(),
      last_active_at: v.number(),
      expire_at: v.number(),
    }),
  },

  handler: async (ctx, args) => {
    const { session: clerkSession } = args;

    console.log(`upserting session ${clerkSession.id}`);
    const sessionRecord = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) =>
        q.eq("clerkSession.id", clerkSession.id)
      )
      .unique();

    if (sessionRecord === null) {
      await ctx.db.insert("sessions", { clerkSession });
    } else {
      await ctx.db.patch(sessionRecord._id, { clerkSession });
    }
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    const userData = ctx.db.query("users").collect();
    const sessionData = ctx.db.query("sessions").collect();

    return Promise.all([userData, sessionData]).then(([users, sessions]) => {
      return users.map((user) => {
        const clerkUser = user.clerkUser;

        const clerkSessions = sessions
          .filter((session) => session.clerkSession.user_id === clerkUser.id)
          .map((session) => session.clerkSession);

        return { user: clerkUser, sessions: clerkSessions };
      });
    });
  },
});
