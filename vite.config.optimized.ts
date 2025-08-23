import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

// Image optimization configuration for future implementation
// Uncomment and install packages when ready to implement:
// npm install -D vite-plugin-imagemin
// import { ViteImageOptimize } from 'vite-plugin-imagemin';

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
    
    // Image optimization plugin (commented out until packages are installed)
    // ViteImageOptimize({
    //   gifsicle: {
    //     optimizationLevel: 7,
    //     interlaced: false,
    //   },
    //   mozjpeg: {
    //     quality: 80,
    //   },
    //   pngquant: {
    //     quality: [0.8, 0.9],
    //     speed: 4,
    //   },
    //   svgo: {
    //     plugins: [
    //       { name: 'removeViewBox' },
    //       { name: 'removeEmptyAttrs', active: false }
    //     ],
    //   },
    //   webp: {
    //     quality: 80,
    //   }
    // }),
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
  // Enhanced build optimization with image handling
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router']
        },
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      }
    },
    // Asset handling configuration
    assetsInlineLimit: 4096, // 4kb - inline small assets as base64
    chunkSizeWarningLimit: 1000, // Warn for chunks larger than 1MB
  },
  // Asset processing options
  assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.webp', '**/*.svg']
});