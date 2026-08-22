// vite.config.ts - مع تحسينات إضافية
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // ✅ إضافة تحسينات الأداء
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // ✅ فصل المكتبات الكبيرة
            'vendor': ['react', 'react-dom', 'lucide-react'],
            'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            'supabase': ['@supabase/supabase-js'],
          },
        },
      },
      // ✅ تصغير الحجم
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // ✅ تحسين الـ Chunks
      chunkSizeWarningLimit: 500,
    },
    // ✅ تحسين الـ Server
    server: {
      warmup: {
        clientFiles: [
          './src/router.tsx',
          './src/routeTree.gen.ts',
        ],
      },
    },
    // ✅ تحسين الـ CSS
    css: {
      devSourcemap: true,
    },
  },
});