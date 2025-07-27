import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 👇 Load environment variables from /way/.env
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');

  return {

    root: path.resolve(__dirname), // f/
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/socket.io': {
          target: 'ws://localhost:5173',
          ws: true,
        }
      }
    },
    build: {
      outDir: path.resolve(__dirname, '../f/dist'), // output to /b/dist
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env': env, // allow usage of import.meta.env.VITE_*
    },
  };
});
