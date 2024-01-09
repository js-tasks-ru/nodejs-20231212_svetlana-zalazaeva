const url = require('url');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    return res.end();
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (!fse.existsSync(filepath)) {
    res.statusCode = 404;
    return res.end();
  }

  switch (req.method) {
    case 'DELETE':
      fse.rmSync(filepath)
      res.end()
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
