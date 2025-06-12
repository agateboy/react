import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/NaraStocksm/',
  server: {
    host: 'localhost',
    port: 5173,
    cors: true,
    allowedHosts: [
      'localhost',
      'gakuro.pythonanywhere.com',
      'naradev-backendup-production.up.railway.app',
      '.ngrok-free.app',
      'https://presumably-needed-horse.ngrok-free.app/',
      'http://127.0.0.1:5001',
      'https://9r1lxdd5-5001.asse.devtunnels.ms/'
    ],
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
});
