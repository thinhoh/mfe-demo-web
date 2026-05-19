import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'packages/product-mfe',
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'product-remote',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList.tsx',
      },
      shared: ['react', 'react-dom', 'lucide-react', 'motion'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,       // 
    host: true,
    cors: true,       // 💡 Bật CORS để App Shell kết nối sang lấy module
    fs: {
      allow: ['../..']
    }
  },
  // Bổ sung preview để test bản build chính xác ở port 3001
  preview: {
    port: 3001,
    cors: true
  }
});
