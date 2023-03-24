import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getUser } from "../../../auth/client";

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = await getUser(req);
  return { req, resHeaders, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
