import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../pages/api/trpc/router";
export const tclient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});
export const authTClient = (token?: string) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/trpc",
        ...(token != null
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {}),
      }),
    ],
  });
