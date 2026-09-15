import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

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
    netlify({
      dev: {
        edgeFunctions: { enabled: false } // ✅ عطل Edge Functions محلياً
      }
    }),
    viteReact(),
  ].filter(Boolean),
  build: {
    chunkSizeWarningLimit: 1000,
  },
});