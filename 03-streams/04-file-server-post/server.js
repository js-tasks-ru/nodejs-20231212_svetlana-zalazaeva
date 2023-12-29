const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const fse = require('fs-extra');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    return res.end();
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fse.existsSync(filepath)) {
    res.statusCode = 409;
    return res.end();
  }


  switch (req.method) {
    case 'POST':
    const limitedStream = new LimitSizeStream({limit: 1000000}); // 1 Мбайт 1000000
    const outStream = fse.createWriteStream(filepath);

    req.pipe(limitedStream).pipe(outStream)
    let needDelete = false;
    let statusCode;

    limitedStream.on('error', (err) => {
        needDelete = true;
        statusCode = 413;
        outStream.close()
    })

    limitedStream.on('close', (err) => {
        if (!needDelete) {
            statusCode = 201;
            res.statusCode = statusCode;
            res.end()
        } 
      })


    outStream.on('close', (err) => {
        if (needDelete) {
            fse.removeSync(filepath)
            res.statusCode = statusCode;
        } 
        res.end()
    })

    req.on('error', (err) => {
        if (err) {
            needDelete = true;
            outStream.close()
            statusCode = 500;
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
