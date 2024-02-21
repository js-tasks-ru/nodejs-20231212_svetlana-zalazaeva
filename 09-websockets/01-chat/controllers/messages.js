const Message = require('../models/Message');
const messageMapper = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  let messages = await Message.find({ chat: ctx.user.id}).limit(20);
  ctx.body = { messages: messages.map(messageMapper) };
};
