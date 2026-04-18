import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        watch: {
          ignored: ['**/data/db.json', '**/data/**/*.json'],
        },
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          }
        }
      },
      plugins: [react()],
      define: {
        // Back-compat for codepaths that read `process.env.*` in the browser.
        // Prefer `API_KEY` (custom/paid), fallback to `GEMINI_API_KEY` (free-tier).
        'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY || ""),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || "")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          // Force Vite to use the browser/web build of @google/genai
          '@google/genai': path.resolve(__dirname, 'node_modules/@google/genai/dist/web/index.mjs'),
        }
      },
      optimizeDeps: {
        include: ['@google/genai'],
        esbuildOptions: {
          target: 'es2022',
        }
      },
      build: {
        outDir: 'dist',
        rollupOptions: {
          external: [],
          output: {
            manualChunks(id) {
              if (id.includes('@google/genai')) return 'genai';
              if (id.includes('pdfjs-dist'))    return 'pdfjs';
              if (id.includes('marked'))        return 'marked';
              if (id.includes('node_modules'))  return 'vendor';
              if (id.includes('components/icons.tsx')) return 'icons';
              if (id.includes('data/'))         return 'data-assets';
            }
          }
        }
      }
    };
});
