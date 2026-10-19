import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import { nitro } from "nitro/vite";

// Netlify بيضيف المتغير NETLIFY وقت البناء. على جهازك أو على الـ VPS هو غير موجود.
const isNetlify = !!process.env.NETLIFY;

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
    isNetlify
      ? netlify({
          dev: {
            edgeFunctions: { enabled: false }, // عطل Edge Functions محلياً
          },
        })
      : nitro(),
    viteReact(),
  ].filter(Boolean),
  build: {
    chunkSizeWarningLimit: 1000,
  },
});