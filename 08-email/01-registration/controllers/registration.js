const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const handleMongooseValidationError = require('../libs/validationErrors');

module.exports.register = async (ctx, next) => {
    const { email, displayName, password } = ctx.request.body;
  //  console.log(email)
    let user = await User.findOne({ email });
    if (user) {
        await handleMongooseValidationError(ctx, next)
    }
    const token = uuid();
    user = new User({ 
        email,
        displayName,
        password,
        verificationToken: token
    });
    await user.save();
    const options = {
        to: email,
        template: 'confirmation',
        locals: { token },
        subject: 'Подтвердите почту',
    }
    await sendMail(options)
};

module.exports.confirm = async (ctx, next) => {
    const { verificationToken } = ctx.request.body;
    let user = await User.findOne({ verificationToken });
    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }
    user.verificationToken = undefined;
    await user.save();
  //  await user.updateOne({ verificationToken: undefined });
  //  console.log(ctx.user)
    let token = await ctx.login(user)
    ctx.body = {token};
};
