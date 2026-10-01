import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: (filePath: string) => {
          const normalized = filePath.replace(/\\/g, '/');
          return (
            normalized.includes('/data/') ||
            normalized.includes('/public/uploads/') ||
            normalized.includes('/uploads/') ||
            normalized.endsWith('/database.json') ||
            normalized.includes('/dist/') ||
            normalized.includes('/.git/')
          );
        },
      },
    },
  };
});
