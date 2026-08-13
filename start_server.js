#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

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
  let filePath = decodeURIComponent(req.url.split('?')[0]);
  if (filePath === '/' || filePath === '') {
    filePath = '/index.html';
  }
  filePath = path.join(root, filePath);
  filePath = path.normalize(filePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error('端口 8082 已被占用，请停止其他服务后重试');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`服务器已启动`);
  console.log(`访问地址: http://localhost:${port}`);
  console.log(`局域网访问: http://192.168.10.21:${port}`);
});
