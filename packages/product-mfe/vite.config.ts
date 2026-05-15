import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'product-remote',
      filename: 'remoteEntry.js',
      // Đây là nơi chúng ta "quảng cáo" những gì Remote này có thể bán
      exposes: {
        './ProductList': './src/ProductList.tsx',
      },
      // Chia sẻ các thư viện dùng chung để trình duyệt không phải tải lại
      shared: ['react', 'react-dom', 'lucide-react', 'motion'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
