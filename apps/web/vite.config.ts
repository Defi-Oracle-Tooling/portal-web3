import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@web3-dashboard': path.resolve(__dirname, '../../packages'),
    },
  },
  optimizeDeps: {
    exclude: ['@web3-dashboard/ui'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['@web3-dashboard/ui'],
    },
  },
}); 