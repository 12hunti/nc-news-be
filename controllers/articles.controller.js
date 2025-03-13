const {
  fetchArticles,
  updateArticleByID,
  fetchArticleById,
  filterArticlesByTopic,
} = require("../models/articles.model");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;

  if (sort_by && order) {
    fetchArticles(sort_by, order)
      .then((orderedArticles) => {
        response.status(200).send({ orderedArticles });
      })
      .catch((err) => {
        next(err);
      });
  } else if (order) {
    fetchArticles("created_at", order)
      .then((orderedArticles) => {
        response.status(200).send({ orderedArticles });
      })
      .catch((err) => {
        next(err);
      });
  } else if (sort_by) {
    fetchArticles(sort_by)
      .then((sortedArticles) => {
        response.status(200).send({ sortedArticles });
      })
      .catch((err) => {
        next(err);
      });
  } else if (topic) {
    filterArticlesByTopic(topic)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((err) => next(err));
  } else {
    fetchArticles()
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
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

exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const articleData = request.body;
  updateArticleByID(article_id, articleData)
    .then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
