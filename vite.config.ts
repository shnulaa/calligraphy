import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const frontendPort = parseInt(env.VITE_FRONTEND_PORT || '33000');
    
    return {
      base: '/',
      publicDir: 'assets',  // 将 assets 目录作为公共资源
      server: {
        port: frontendPort,
        host: '0.0.0.0',
      },
      preview: {
        port: frontendPort,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.VITE_BACKEND_HOST': JSON.stringify(env.VITE_BACKEND_HOST),
        'process.env.VITE_BACKEND_PORT': JSON.stringify(env.VITE_BACKEND_PORT),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
