import http from 'http';
import handler from './getBotResponse';

const PORT = Number(process.env.DIAL_API_PORT ?? 4250);
const HOST = process.env.DIAL_API_HOST ?? '127.0.0.1';

const server = http.createServer(async (req, res) => {
  const url = req.url ?? '/';

  if (req.method === 'GET' && (url === '/health' || url === '/healthz')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end('{"ok":true}');
    return;
  }

  if (url === '/api/getBotResponse') {
    try {
      await handler(req, res);
    } catch (err) {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'unhandled', message: err instanceof Error ? err.message : 'unknown' }));
      }
    }
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end('{"error":"not_found"}');
});

server.listen(PORT, HOST, () => {
  console.log(`[dial-api] listening on http://${HOST}:${PORT}`);
});
