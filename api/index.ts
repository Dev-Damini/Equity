import { Hono } from "hono";
import { serve } from "@hono/node-server"; // Important: Change this
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { readFile } from "node:fs/promises";

const app = new Hono();

// 1. CORS Configuration
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173", "https://equityspringgroup.vercel.app"], // Add your Render URL here later
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 2. tRPC Handler
app.all("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// 3. Serve Frontend Static Assets (JS/CSS)
app.use("/assets/*", serveStatic({ root: "./dist/client" }));
app.use("/vite.svg", serveStatic({ path: "./dist/client/vite.svg" }));

// 4. SPA Fallback: Serve index.html for all other routes
// This ensures React Router works (Home, Admin, Success, etc.)
app.get("/*", async (c) => {
  try {
    const html = await readFile("./dist/client/index.html", "utf-8");
    return c.html(html);
  } catch (err) {
    return c.text("Build not found. Check dist/client/index.html", 404);
  }
});

// 5. Start the server for Render
const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});