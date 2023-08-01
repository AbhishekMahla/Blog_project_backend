const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
  // check user is login
  if (req.session.userAuth) {
    next();
  } else {
    next(appErr("User is not Login"));
  }
};

module.exports = protected;
