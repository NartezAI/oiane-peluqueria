// Servidor estático mínimo para previsualizar la web
const http = require('http');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.mp4': 'video/mp4', '.json': 'application/json'
};

http.createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split('?')[0]);
  if (ruta === '/') ruta = '/index.html';
  const archivo = path.join(raiz, ruta);
  if (!archivo.startsWith(raiz)) { res.writeHead(403); return res.end(); }
  fs.readFile(archivo, (err, datos) => {
    if (err) { res.writeHead(404); return res.end('No encontrado'); }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(archivo).toLowerCase()] || 'application/octet-stream' });
    res.end(datos);
  });
}).listen(process.env.PORT || 8748, function () {
  console.log('Servidor en http://localhost:' + this.address().port);
});
