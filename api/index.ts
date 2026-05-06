import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const app = new Hono();

// 1. CORS Configuration (CRITICAL FOR DOMAIN CONNECTION)
app.use(
  "/api/*",
  cors({
    origin: [
      "http://localhost:5173", 
      "https://equity-76cl.onrender.com",
      "https://equityspringgroup.com",      // REPLACE WITH YOUR ACTUAL DOMAIN
      "https://www.equityspringgroup.com"  // INCLUDE THE WWW VERSION
    ],
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

// 3. Serve Frontend Static Assets
const clientDistPath = path.resolve("dist/client");

app.use("/assets/*", serveStatic({ root: "./dist/client" }));
app.use("/vite.svg", serveStatic({ path: "./dist/client/vite.svg" }));
app.use("/favicon.ico", serveStatic({ path: "./dist/client/favicon.ico" }));

// 4. SPA Fallback
app.get("/*", async (c) => {
  const url = new URL(c.req.url);
  
  if (url.pathname.startsWith("/api") || url.pathname.includes(".")) {
    return c.json({ error: "Not Found" }, 404);
  }

  try {
    const indexPath = path.join(clientDistPath, "index.html");
    const html = await readFile(indexPath, "utf-8");
    return c.html(html);
  } catch (err) {
    return c.text("Frontend build not found. Ensure 'npm run build' was successful.", 500);
  }
});

// 5. Start the server
const port = Number(process.env.PORT) || 3000;
console.log(`🚀 EquitySpring Server live at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});