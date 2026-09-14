// serve.js - يستدعي SSR مباشرة (بدون Nitro wrapper)

import { createServer, request as httpRequest } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

const CLIENT_DIR = join(__dirname, '.output', 'public');
const SSR_ENTRY = join(__dirname, '.output', 'server', '_ssr', 'index.mjs');
const PORT = process.env.PORT || 3000;

console.log('🚀 Loading SSR handler...');

// ✅ استيراد SSR handler مباشرة
let ssrHandler;
try {
  const mod = await import(`file://${SSR_ENTRY.replace(/\\/g, '/')}`);
  ssrHandler = mod.default || mod;
  console.log('✅ SSR handler loaded');
  console.log('   Has fetch:', typeof ssrHandler?.fetch);
} catch (err) {
  console.error('❌ Failed to load SSR:', err);
  process.exit(1);
}

function hasExtension(url) {
  const last = url.split('/').pop() || '';
  return last.includes('.') && last.split('.').length >= 2;
}

function isDevRequest(req) {
  const host = req.headers.host || '';
  return (
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes(':3000') ||
    host.includes(':3001')
  );
}

// ✅ تحويل Node IncomingMessage → Web Request
async function nodeToWebRequest(req) {
  const protocol = req.socket?.encrypted ? 'https' : 'http';
  const host = req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, String(v)));
    } else if (value !== undefined) {
      headers.set(key, String(value));
    }
  }

  const method = req.method || 'GET';
  let body;

  if (!['GET', 'HEAD'].includes(method)) {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    body = Buffer.concat(chunks);
  }

  return new Request(url, {
    method,
    headers,
    body,
  });
}

// ✅ إرسال Web Response → Node ServerResponse
async function webToNodeResponse(webRes, res) {
  res.statusCode = webRes.status;

  webRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-encoding') return;
    if (key.toLowerCase() === 'content-length') return;
    res.setHeader(key, value);
  });

  if (!webRes.body) {
    res.end();
    return;
  }

  const reader = webRes.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}

const server = createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const isDev = isDevRequest(req);

  // ✅ 1. الملفات الثابتة
  if (hasExtension(url)) {
    const pathname = normalize(decodeURIComponent(url)).replace(/^(\.\.[\/\\])+/, '');
    const filePath = join(CLIENT_DIR, pathname);

    // ✅ في التطوير: احجب sw.js
    if (pathname === '/sw.js' && isDev) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Service Worker disabled in development');
      console.log(`🚫 [Dev] /sw.js blocked`);
      return;
    }

    try {
      const stats = await stat(filePath);
      if (stats.isFile()) {
        const data = await readFile(filePath);
        const ext = extname(filePath).toLowerCase();
        res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
        res.setHeader('Content-Length', data.length);

        if (isDev) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else {
          if (pathname === '/sw.js') {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }

        res.statusCode = 200;
        res.end(data);
        console.log(`📄 [200] ${url}`);
        return;
      }
    } catch {}
  }

  // ✅ 2. SSR مباشرة (كل شيء آخر)
  try {
    const webRequest = await nodeToWebRequest(req);
    const webResponse = await ssrHandler.fetch(webRequest, process.env, {});

    // ✅ إضافة Cache-Control لـ HTML في التطوير
    const contentType = webResponse.headers.get('content-type') || '';
    if (isDev && contentType.includes('text/html')) {
      webResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      webResponse.headers.set('Pragma', 'no-cache');
      webResponse.headers.set('Expires', '0');
    }

    await webToNodeResponse(webResponse, res);
    console.log(`🖥️  [${webResponse.status}] ${req.method} ${url}`);
  } catch (err) {
    console.error('❌ SSR error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`<h1>Internal Server Error</h1><pre>${err.message}</pre>`);
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('════════════════════════════════════════════');
  console.log(`✅ Server on http://0.0.0.0:${PORT}`);
  console.log(`📁 Static files from: ${CLIENT_DIR}`);
  console.log(`🖥️  SSR handler: ${SSR_ENTRY}`);
  console.log('════════════════════════════════════════════');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.close();
  process.exit(0);
});