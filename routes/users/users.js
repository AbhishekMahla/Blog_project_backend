const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const protected = require("../../middlewares/protected");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");

const userRoutes = express.Router();

// Instance of multer
const upload = multer({ storage });

//POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/users/profile
userRoutes.get("/profile", protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put(
  "/profile-photo-upload/",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
);

//PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put(
  "/cover-photo-upload/",
  protected,
  upload.single("coverimage"),
  uploadCoverImgCtrl
);

//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/:id", updatePasswordCtrl);

//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);
//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);
//PUT/api/v1/users/update/:id
userRoutes.put("/update/:id", updateUserCtrl);
module.exports = userRoutes;
