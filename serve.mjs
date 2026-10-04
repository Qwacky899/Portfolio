import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
};

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (file !== root && !file.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  let stats;
  try {
    stats = statSync(file);
    if (!stats.isFile()) throw new Error('Not a file');
  } catch {
    response.writeHead(404).end('Not found');
    return;
  }

  const headers = {
    'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-cache',
  };
  const range = request.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
  if (range) {
    const start = range[1] ? Number(range[1]) : Math.max(0, stats.size - Number(range[2]));
    const end = range[1] ? (range[2] ? Number(range[2]) : stats.size - 1) : stats.size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || end >= stats.size) {
      response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
      return;
    }
    response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stats.size}`, 'Content-Length': end - start + 1 });
    createReadStream(file, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, { ...headers, 'Content-Length': stats.size });
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}`);
});
