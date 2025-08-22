import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      quoteStyle: 'single',
      semicolons: false,
      disableTypes: false,
      addExtensions: false,
      enableRouteGeneration: false, // Disable during development to fix refresh issue
      autoCodeSplitting: true,
      indexToken: 'index',
      routeToken: 'route',
      routeFileIgnorePrefix: '-',
    }),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['@tanstack/react-router'],
    include: [
      // helps Vite prebundle correctly
      'use-sync-external-store/shim/with-selector',
      'idb-keyval',
      '@tanstack/react-query',
      '@tanstack/query-persist-client-core',
    ],
  },
  define: {
    // React 19 compatibility fix
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  resolve: {
    alias: {
      // Comprehensive use-sync-external-store shim replacement
      'use-sync-external-store/shim/with-selector': path.resolve(__dirname, 'src/shims/use-sync-external-store/with-selector.ts'),
      'use-sync-external-store/shim/with-selector.js': path.resolve(__dirname, 'src/shims/use-sync-external-store/with-selector.ts'),
      'use-sync-external-store/with-selector': path.resolve(__dirname, 'src/shims/use-sync-external-store/with-selector.ts'),
      'use-sync-external-store': path.resolve(__dirname, 'src/shims/use-sync-external-store/index.ts'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  server: {
    port: 5173
  },
  // Add build optimization with image handling
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router']
        },
        // Optimize asset file naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          const info = name.split('.');
          const ext = info[info.length - 1];
          if (/webp|jpg|jpeg|png|gif|svg/.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Image optimization settings
    assetsInlineLimit: 4096, // Images smaller than 4KB will be inlined as base64
  }
});
