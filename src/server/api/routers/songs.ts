import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return { id: user.id, username: user.username, imageUrl: user.imageUrl };
};

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});
export const songRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        artist: z.string(),
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(input.title);

      if (!success) {
        throw new TRPCError({
          message: "Rate limit exceeded",
          code: "TOO_MANY_REQUESTS",
        });
      }
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.song.create({
        data: {
          title: input.title,
          artist: input.artist,
          key: input.key,
          createdAt: new Date(),
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const songs = await ctx.db.song.findMany({ take: 25 });

    const users = (
      await clerkClient.users.getUserList({
        userId: songs.map((song) => song.title),
        limit: 25,
      })
    ).map(filterUserForClient);

    return songs.map((song) => {
      const user = users.find((user) => user.id === String(song.id));
      // if (!user) {
      //   throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
      // }
      return {
        song,
        user,
      };
    });
  }),
});
