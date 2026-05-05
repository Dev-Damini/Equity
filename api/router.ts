import { createRouter, publicQuery } from "./middleware";
import { applicationRouter } from "./routers/application";
import { settingsRouter } from "./routers/settings";
import { emailRouter } from "./routers/email";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  application: applicationRouter,
  settings: settingsRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
