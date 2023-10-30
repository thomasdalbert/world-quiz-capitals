/// <reference types="vitest" />
import {defineConfig} from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // setupFiles: ['./tests/setup.ts'],
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@common': path.resolve(__dirname, '../common')
    }
  },
  plugins: [react(), tsConfigPaths()]
})
