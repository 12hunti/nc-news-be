const {
  fetchArticles,
  updateArticleByID,
  fetchArticleById,
} = require("../models/articles.model");

exports.getArticles = (request, response, next) => {

  const { sort_by, order } = request.query;

  //console.log(request.query, "request.query in controller")

  if(sort_by && order){
    fetchArticles(sort_by, order).then((rows) => {
        response.status(200).send({orderedArticles: rows})
    }).catch((err) => {
        next(err)
    })
  }

  else if(order){
    fetchArticles("created_at", order).then((rows) => {
        response.status(200).send({orderedArticles: rows})
    })
  }

  else if (sort_by) {
    fetchArticles(sort_by)
      .then((rows) => {
        response.status(200).send({ sortedArticles: rows });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchArticles()
      .then(({ rows }) => {
        response.status(200).send({ articles: rows });
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
