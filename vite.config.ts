import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ← ここが GitHub Pages 用の設定
  base: '/osewa/',
});
