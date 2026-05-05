import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const __dirname = path.resolve();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
    },
  },
  build: {
    outDir: "dist/client", // Keeps client files separate
    emptyOutDir: true,
  },
});
