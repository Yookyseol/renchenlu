const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = process.cwd();
const port = 8082;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let filePath = decodeURIComponent(parsedUrl.pathname);
  if (filePath === '/' || filePath === '') {
    filePath = '/index.html';
  }
  filePath = path.normalize(filePath);
  const normalizedRoot = path.normalize(root);
  if (!filePath.startsWith(normalizedRoot)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(content);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`壬辰录网站服务器已启动`);
  console.log(`访问地址: http://localhost:${port}`);
  console.log(`局域网访问: http://192.168.10.21:${port}`);
});
