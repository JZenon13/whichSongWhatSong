import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.song.findMany();
  }),
});
