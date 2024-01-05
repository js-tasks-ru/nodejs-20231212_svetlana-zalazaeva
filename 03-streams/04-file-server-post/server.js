const http = require('node:http');
const path = require('node:path');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const fs = require('node:fs');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'POST':

    if (pathname.includes('/')) {
      res.statusCode = 400;
      res.end();
      return;
    }

    const limitedStream = new LimitSizeStream({limit: 1000000}); // 1 Мбайт 1000000
    const outStream = fs.createWriteStream(filepath, { flags: 'wx' });

    outStream.on('finish', () => {
      res.statusCode = 201;
      res.end()
    })

    res.on('close', () => {
      if (!req.complete) 
        fs.unlink(filepath, () => {});
    })


    outStream.on('error', (err) => {
      if (err.code === 'EEXIST') {
        res.statusCode = 409;
        res.end();
      } else {
        res.statusCode = 500;
        res.end();
      }
    })

    limitedStream.on('error', (err) => {
      if (err.code === 'LIMIT_EXCEEDED') {
        res.statusCode = 413;
        res.end();
      } else {
        res.statusCode = 500;
        res.end();
      }
    })

    req.pipe(limitedStream).pipe(outStream)

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
})

module.exports = server;
