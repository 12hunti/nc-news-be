const {
  fetchCommentsByArticleId,
  insertCommentsByArticleId,
  removeCommentsbyCommentId,
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

exports.deleteCommentByCommentId = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentsbyCommentId(comment_id)
    .then((deletedComment) => {
      response.status(204).send({ deletedComment });
    })
    .catch((err) => {
      next(err);
    });
};
