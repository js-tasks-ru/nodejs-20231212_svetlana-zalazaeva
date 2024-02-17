const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (email) {
    let user = await User.findOne({ email })
    if (!user) {
      try {
        user = new User({ email, displayName});
        await user.save();
      } catch (err) {
        done(err);
      }
    }
    done(null, user);
  } else {
    done(null, false, `Не указан email`);
  }
};
