const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    let str = chunk.toString();
    let lastIndexEol = str.lastIndexOf(os.EOL);
    let firstIndexEol = str.indexOf(os.EOL);
    if (lastIndexEol === -1 && firstIndexEol === -1) {
      this.data += str;
      callback()
    } else if (lastIndexEol !== -1 && lastIndexEol + os.EOL.length === chunk.length) {
      this.data += str.substring(0, lastIndexEol);
      this._flush(callback)
    } else if (lastIndexEol !== -1 && firstIndexEol !== -1) {
      this.data += str.substring(0, lastIndexEol)
      this._flush(callback)
      this.data = str.substring(lastIndexEol + os.EOL.length, str.length)
    } 
  }

  _flush(callback) {
    if (this.data !== undefined && this.data !== '') {
      this.data = this.data.split(os.EOL)
      for (let elem of this.data) {
        this.push(elem)
      }
      this.data = ''
    }
    callback()
  }
}

module.exports = LineSplitStream;
