import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        'exercise-page': 'src/js/exercise-page.js',
        'assignment-page': 'src/js/assignment-page.js',
        'index-page': 'src/js/index-page.js',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name][extname]',
      },
    },
    outDir: 'dist/assets',
    emptyOutDir: false,
    cssCodeSplit: false,
  },
});
