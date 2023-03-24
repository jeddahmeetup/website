import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { supabase } from "../../../auth/client";
import { adminClient } from "../../../auth/adminClient";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;

const getPagination = (skip: number, limit: number) => {
  const size = limit ? +limit : 3;
  const from = skip ? skip * size : 0;
  const to = skip ? from + limit : limit;

  return [from, to] as const;
};

interface Topic {
  id: string;
  title: string;
  full_name: string;
  username: string;
  avatar_url: string;
}

const topicsRouter = router({
  //   createPost: publicProcedure
  //     .input(z.object({ title: z.string() }))
  //     .mutation(({ input }) => {
  //       const post = {
  //         id: ++id,
  //         ...input,
  //       };
  //       db.posts.push(post);
  //       return post;
  //     }),
  //   listPosts: publicProcedure.query(() => db.posts),
  addTopic: publicProcedure
    .input(
      z.object({
        title: z.string().min(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user == null) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await adminClient
        .from("topics")
        .insert({
          title: input.title,
          suggested_by: ctx.user.id,
        })
        .returns();
      if (result.error) {
        console.log("error creating topic", result.error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return true;
    }),
  topics: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(20),
        skip: z.number().optional().default(0),
        orderBy: z.enum(["newest", "popular"]).optional().default("newest"),
      })
    )
    .query(async ({ input: { limit, skip, orderBy }, ctx }) => {
      console.log("ctx", ctx.req);
      const result = await adminClient
        .from("topics")
        .select("*, profile:profiles ( full_name, username, avatar_url )")
        .order(orderBy === "newest" ? "created_at" : "created_at", {
          ascending: false,
        })
        .range(...getPagination(skip, limit));
      return result.data?.map((topic) => ({
        id: topic.id,
        title: topic.title,
        ...(Array.isArray(topic.profile)
          ? topic.profile[0]
          : topic.profile ?? {}),
      }));
    }),
});

export const appRouter = router({
  topics: topicsRouter,
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `hello ${input ?? "world"}`;
  }),
});

export type AppRouter = typeof appRouter;
