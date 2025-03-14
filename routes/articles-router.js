const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require("../controllers/comments.controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentsByArticleId);

articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter