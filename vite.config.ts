import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    server: {
      port: 4000,
      host: true,
      hmr: {
        overlay: false,
      },
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    plugins: [
      tsConfigPaths(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      // ✅ الكود الصحيح: اختيار preset بناءً على البيئة ليعمل بسلاسة على Vercel أو محلياً
      isBuild 
        ? nitro({ preset: process.env.VERCEL ? 'vercel' : 'node-server' }) 
        : undefined,
    ].filter(Boolean),
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});