import type { APIRoute } from "astro";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

export const all: APIRoute = ({ request, cookies }) => {
  console.log("requestzzz", request);
  console.log("cookies", request.headers.get("sbat"));
  console.log("cookiesz", cookies.get("sbat"));
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  });
};
