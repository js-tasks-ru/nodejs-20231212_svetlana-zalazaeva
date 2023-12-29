const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const fs = require('fs');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    return res.end();
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    return res.end();
  }


  switch (req.method) {
    case 'POST':
    const limitedStream = new LimitSizeStream({limit: 1000000}); // 1 Мбайт 1000000
    const outStream = fs.createWriteStream(filepath);

    req.pipe(limitedStream).pipe(outStream)
    let bigFile = false;

    limitedStream.on('error', (err) => {
        bigFile = true
        outStream.close()
    })

    limitedStream.on('close', (err) => {
        if (!bigFile) {
            res.statusCode = 201;
            res.end()
        } 
      })


    outStream.on('close', (err) => {
        if (bigFile) {
            fs.rmSync(filepath)
            res.statusCode = 413;
        } 
        res.end()
    })

    req.on('error', (err) => {
        if (err) {
            bigFile = false;
            outStream.close()
            fs.rmSync(filepath)
            res.statusCode = 500;
        }
        res.end()
    })

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
})

module.exports = server;
