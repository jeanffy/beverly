import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "src/frontend/style.scss";',
      },
    },
  },
  plugins: [vue()],
  root: './src/frontend',
  //publicDir: './src/frontend/public',
  build: {
    outDir: '../../dist/frontend',
    rollupOptions: {
      input: './src/frontend/index.html'
    }
  },
});
