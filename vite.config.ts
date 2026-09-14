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
      // ✅ تفعيل Nitro فقط أثناء البناء (build)، وليس أثناء التطوير (dev)
      isBuild ? nitro({ preset: 'node-server' }) : undefined,
    ].filter(Boolean),
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});