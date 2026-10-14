import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Proyecto-Vino-/', // ← Agregar esta línea
  server: {
    port: 3001,
  },
});