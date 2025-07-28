const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user_id) => {
  const sessionObject = {
    passport: {
      user: user_id,
    },
  };

  const session = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );

  const sig = keygrip.sign("session=" + session);
  return {session,sig}
};
