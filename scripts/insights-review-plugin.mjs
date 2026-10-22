import { randomBytes } from 'node:crypto';
import { reviewStore } from './insights-review-store.mjs';

export default function insightsReviewPlugin() {
  return {
    name: 'local-insights-review',
    apply: 'serve',
    configureServer(server) {
      const store = reviewStore(server.config.root);
      const token = randomBytes(32).toString('hex');
      server.middlewares.use('/__insights-review', async (req, res) => {
        const send = (status, data) => {
          res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify(data));
        };
        const host = req.headers.host ?? '';
        if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) return send(403, { error: 'Review is available on this computer only.' });
        try {
          if (req.method === 'GET' && req.url === '/') return send(200, { articles: store.list(), token });
          if (req.method !== 'POST') return send(405, { error: 'Method not allowed.' });
          if (req.headers.origin !== `http://${host}` || req.headers['x-review-token'] !== token || !req.headers['content-type']?.startsWith('application/json')) return send(403, { error: 'Reload the local dashboard to continue.' });
          const match = req.url?.match(/^\/([a-z0-9-]+)$/);
          if (!match) return send(404, { error: 'Article not found.' });
          const chunks = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 1024 * 1024) return send(413, { error: 'Draft is too large.' });
            chunks.push(chunk);
          }
          send(200, store.save(match[1], JSON.parse(Buffer.concat(chunks).toString('utf8'))));
        } catch (error) {
          send(error.code === 'ENOENT' ? 404 : (error.status ?? 400), { error: error.message });
        }
      });
    }
  };
}
