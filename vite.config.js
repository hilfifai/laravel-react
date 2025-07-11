import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.jsx',
      refresh: true,
    }),
    react({
      jsxRuntime: 'classic' // Tambahkan ini
    }),
  ],
  resolve: {
   alias: {
      '@': '/resources/js',
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@inertiajs/inertia',
        '@inertiajs/inertia-react',
        'react-router-dom'
      ],
    },
  },
});