const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const Comment = require("../../models/comments/Comment");
const appErr = require("../../utils/appErr");
//create
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // create comment
    const comments = await Comment.create({
      user: req.session.userAuth,
      message,
    });
    // push the comment to post
    post.comments.push(comments._id);
    // find user
    const user = await User.findById(req.session.userAuth);
    // push the comment to user
    user.comments.push(comments._id);
    // disable validation
    // save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//single
const commentDetailsCtrl = async (req, res, next) => {
  try {
    // find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("comment is not present"));
    }
    res.json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//delete
const deleteCommentCtrl = async (req, res, next) => {
  try {
    // find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("comment is not present"));
    }
    // check if the comment belog to the loging user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this comment", 403));
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      user: "Comment deleted",
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

//Update
const upddateCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("comment is not present"));
    }
    // check if the post belog to the loging user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to Update this comment", 403));
    }
    const commentUpdated = await Post.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.message,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: commentUpdated,
    });
  } catch (error) {
    res.json(next(appErr(error.message)));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl,
};
