const commentsRouter = require("express").Router();

const {
  deleteCommentByCommentId, patchCommentByCommentID
} = require("../controllers/comments.controller");

commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

commentsRouter.patch("/:comment_id", patchCommentByCommentID)

module.exports = commentsRouter;
