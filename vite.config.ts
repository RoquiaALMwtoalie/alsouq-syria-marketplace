// vite.config.ts - إعداد مباشر بدون Lovable wrapper
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      // ✅ الهدف الصحيح لـ Cloudflare Pages
      target: "cloudflare-pages",
      server: { entry: "server" },
    }),
    viteReact(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor';
            if (id.includes('lucide-react')) return 'lucide';
            if (id.includes('@radix-ui')) return 'ui';
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            return 'vendor';
          }
          return null;
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 500,
  },
  server: {
    warmup: {
      clientFiles: [
        './src/router.tsx',
        './src/routeTree.gen.ts',
      ],
    },
  },
  css: {
    devSourcemap: true,
  },
});