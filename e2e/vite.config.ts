import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(), 
    svgr() 
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../client/src')
    }
  }
});