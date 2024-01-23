import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return { id: user.id, username: user.username, imageUrl: user.imageUrl };
};
export const songRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        artist: z.string().min(1),
        key: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      if (!user) {
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
      }

      return {
        song,
        user,
      };
    });
  }),
});
