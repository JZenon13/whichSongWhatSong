import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

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

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.song.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
