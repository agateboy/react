import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/NaraStock/',
  server: {
    host: 'localhost',
    port: 5173,
    cors: true,
    allowedHosts: [
      'localhost',
      'gakuro.pythonanywhere.com',
      'naradev-backendup-production.up.railway.app',
    ],
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
});
