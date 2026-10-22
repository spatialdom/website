import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore Local development middleware is intentionally outside the client bundle.
import insightsReviewPlugin from './scripts/insights-review-plugin.mjs';

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'review' ? [insightsReviewPlugin()] : [])],
  server: { host: '127.0.0.1' },
  base: process.env.VITE_BASE_PATH || '/'
}));
