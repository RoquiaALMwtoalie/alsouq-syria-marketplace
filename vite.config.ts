import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 4000,
    host: true,
    hmr: { overlay: false },
    watch: { usePolling: true, interval: 100 },
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    nitro(), // ✅ بدون preset — Nitro يكتشف Vercel تلقائياً
  ],
  build: {
    chunkSizeWarningLimit: 1000,
  },
});