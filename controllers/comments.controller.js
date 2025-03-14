const {
  fetchCommentsByArticleId,
  insertCommentsByArticleId,
  removeCommentsbyCommentId,
  updateCommentByCommentId,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { author, body } = request.body;
  insertCommentsByArticleId(author, body, article_id)
    .then((newComment) => {
      response.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentByCommentID = (request, response, next) => {
  const { comment_id } = request.params;
  const commentData = request.body;
  updateCommentByCommentId(comment_id, commentData)
    .then((updatedComment) => {
      response.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentsbyCommentId(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
