import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'app-shell',
      // Đây là nơi Host định nghĩa các "nguồn hàng" (Remote)
      remotes: {
        // 'productApp' là tên chúng ta dùng trong code
        // URL là nơi Remote đang chạy (ví dụ cổng 3001)
        productApp: 'http://localhost:3001/assets/remoteEntry.js',
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
});
