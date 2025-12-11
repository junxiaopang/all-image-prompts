import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      css: {
        postcss: './postcss.config.js',
        devSourcemap: true
      },
      build: {
        cssCodeSplit: false
      }
    };
});
