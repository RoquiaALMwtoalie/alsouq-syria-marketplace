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
          // ✅ ✅ ✅ تحويل manualChunks من Object إلى Function
          manualChunks(id: string) {
            // ✅ فصل المكتبات الكبيرة
            if (id.includes('node_modules')) {
              // ✅ React + React DOM
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor';
              }
              // ✅ Lucide React
              if (id.includes('lucide-react')) {
                return 'lucide';
              }
              // ✅ Radix UI
              if (id.includes('@radix-ui')) {
                return 'ui';
              }
              // ✅ Supabase
              if (id.includes('@supabase/supabase-js')) {
                return 'supabase';
              }
              // ✅ باقي الـ node_modules
              return 'vendor';
            }
            // ✅ إذا كان الملف مش من node_modules
            return null;
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