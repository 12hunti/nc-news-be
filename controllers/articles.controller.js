const { fetchArticles, fetchArticleById } = require("../models/articles.model");

exports.getArticles = (request, response, next) => {
  fetchArticles()
    .then(({ rows }) => {
      response.status(200).send({ articles: rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
