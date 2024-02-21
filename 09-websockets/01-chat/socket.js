const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server, {
    allowEIO3: true // false by default
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token)  {
      next(new Error('anonymous sessions are not allowed'));
    } 
    let session = await Session.findOne({ token }).populate('user');
    if (!session) {
      next(new Error('wrong or expired session token'));
    }
    socket.user = session.user;
    next();
  });

  io.on('connection', (socket) => {
    socket.on('message', async (msg) => {
      let message = new Message({ 
        date: new Date(),
        text: msg,
        chat: socket.user.id,
        user: socket.user.displayName
      });
      await message.save();
    });
  });
  
  return io;
}

module.exports = socket;
