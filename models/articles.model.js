const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchArticles = (
  sortBy = "created_at",
  order = "desc",
  topic = null
) => {
  const validSortColumns = ["created_at", "votes", "author", "topic", "title"];
  const validOrderColumns = ["asc", "desc"];
  const validTopicColumns = ["mitch", "cats", "paper"]; //football, cooking and coding for dev data
  const orderDirection = order || "desc";
  let queryString = "SELECT * FROM articles";
  if (!validSortColumns.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "invalid sort by value" });
  }
  if (order && !validOrderColumns.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order value" });
  }
  if (topic && !validTopicColumns.includes(topic)) {
    return Promise.reject({ status: 400, msg: "invalid topic value" });
  }
  if (topic) {
    queryString += ` WHERE topic = $1`;
  }
  queryString += ` ORDER BY ${sortBy} ${orderDirection.toUpperCase()}`;
  if (topic) {
    return db.query(queryString, [topic]).then(({ rows }) => {
      return rows;
    });
  } else {
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      }
      return rows[0];
    });
};

exports.updateArticleByID = (article_id, articleData) => {
  const { inc_votes } = articleData;
  //check if any unwanted fields
  const validFields = ["inc_votes"];
  const receivedFields = Object.keys(articleData);
  const invalidFields = receivedFields.filter(
    (field) => !validFields.includes(field)
  );
  if (invalidFields.length > 0) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }
  //main query
  return checkExists("articles", "article_id", article_id).then(() => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
