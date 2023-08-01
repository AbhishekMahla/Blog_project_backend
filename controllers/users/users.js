const User = require("../../models/user/User");
const bcrypt = require("bcrypt");
const appErr = require("../../utils/appErr");
//register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  // check if field is empty
  if (!fullname || !password || !email) {
    return next(appErr("Fields are empty"));
  }
  try {
    // 1. check if user exist (email)
    const userFound = await User.findOne({ email });
    // throw an error
    if (userFound) {
      return next(appErr("User already Exist"));
    }
    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPass = bcrypt.hashSync(password, salt);
    // register user
    const user = await User.create({
      fullname,
      email,
      password: hashPass,
    });
    res.json({
      status: "success",
      user: user,
    });
  } catch (error) {
    res.json(error);
  }
};

//login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  // check if field is empty
  if (!password || !email) {
    return next(appErr("Fields are required"));
  }
  try {
    // 1. check if user exist (email)
    const userFound = await User.findOne({ email });
    // throe an error
    if (!userFound) {
      return next(appErr("Invalid login credentials"));
    }
    // Check Password
    const checkPass = await bcrypt.compare(password, userFound.password);
    if (!checkPass) {
      return next(appErr("Invalid login credentials"));
    }
    // save the user id
    req.session.userAuth = userFound._id;
    res.json({
      status: "success",
      data: userFound,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//details
const userDetailsCtrl = async (req, res, next) => {
  try {
    // get userId from Params
    const userId = req.params.id;
    // find the user
    const user = await User.findById(userId);
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};
//profile
const profileCtrl = async (req, res) => {
  // get the login user
  const user = req.session.userAuth;
  // find user
  const userFound = await User.findById(user)
    .populate("posts")
    .populate("comments");
  try {
    res.json({
      status: "success",
      data: userFound,
    });
  } catch (error) {
    res.json(error);
  }
};

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    // find user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // check if user is found
    if (!userFound) {
      return next(appErr("User not found", 403));
    }
    // udated profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      user: "User profile image upload",
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//upload cover image

const uploadCoverImgCtrl = async (req, res, next) => {
  try {
    // find user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // check if user is found
    if (!userFound) {
      return next(appErr("User not found", 403));
    }
    // udated profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      user: "User cover image upload",
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//update password
const updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    // check if user updating password
    if (password) {
      //  Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPass = bcrypt.hashSync(password, salt);
      // udated password
      await User.findByIdAndUpdate(
        req.params.id,
        {
          password: hashPass,
        },
        {
          new: true,
        }
      );
    }

    res.json({
      status: "success",
      user: "User password update",
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;

  try {
    // check email is taken or not
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appErr("Email is taken", 400));
      }
    }
    // update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//logout
const logoutCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User logout",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
