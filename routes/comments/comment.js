const express = require("express");
const protected = require("../../middlewares/protected");
const {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl,
} = require("../../controllers/comments/comments");

const commentRoutes = express.Router();

//POST/api/v1/comments
commentRoutes.post("/:id", protected, createCommentCtrl);

//GET/api/v1/comments/:id
commentRoutes.get("/:id", commentDetailsCtrl);

//DELETE/api/v1/comments/:id
commentRoutes.delete("/:id", protected, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRoutes.put("/:id", protected, upddateCommentCtrl);

module.exports = commentRoutes;
