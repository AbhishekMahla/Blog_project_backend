const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");
//create
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, user, image } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return next(appErr("All field are required"));
    }
    // find user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // create post
    const postCreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: userFound._id,
    });
    // Push the post created into the array of user's posts
    userFound.posts.push(postCreated._id);
    // re save
    userFound.save();
    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    res.json(error);
  }
};

//all
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//details
const fetchPostCtrl = async (req, res, next) => {
  try {
    // get the id from the paramas
    const id = req.params.id;
    // find the post
    const post = await Post.findById(id).populate("comments");
    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//delete
const deletePostCtrl = async (req, res) => {
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // check if the post belog to the loging user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this post", 403));
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      user: "Post deleted",
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//update
const updatepostCtrl = async (req, res, next) => {
  const { title, description, category, image } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // check if the post belog to the loging user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to Update this post", 403));
    }
    const postUpdated = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        image: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: postUpdated,
    });
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatepostCtrl,
};
