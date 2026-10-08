import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'participants-resistance-engines-lane.trycloudflare.com',
      'localhost',
    ],
  },
});