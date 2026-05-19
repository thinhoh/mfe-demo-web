import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'packages/app-shell',
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'app-shell',
      remotes: {
        //  Khi DEV, file remoteEntry nằm ở thư mục gốc /dist/ chứ không phải /assets/
        productApp: 'http://localhost:3001/dist/assets/remoteEntry.js',
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
    port: 3000,       //  Đóng đinh port 3000 cho App Shell
    host: true,
    cors: true,
    fs: {
      allow: ['../..']
    }
  }
});
