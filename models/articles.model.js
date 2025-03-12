const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchArticles = (sortValue, orderValue, topicValue) => {
  const validSortColumns = ["created_at", "votes", "author", "topic", "title"];
  const validOrderColumns = ["asc", "desc"];
  const orderDirection =
    orderValue && validOrderColumns.includes(orderValue) ? orderValue : "desc";
  let queryString = `SELECT * FROM articles `;
  //if not an allowed input send an error
  if (sortValue && !validSortColumns.includes(sortValue)) {
    return Promise.reject({ status: 400, msg: "invalid sort by value" });
  }
  //if not allowed order value
  else if (orderValue && !validOrderColumns.includes(orderValue)) {
    return Promise.reject({ status: 400, msg: "invalid order value" });
  }
  //if /api/articles?sort_by=&order=
  else if (
    sortValue &&
    validSortColumns.includes(sortValue) &&
    orderValue &&
    validOrderColumns.includes(orderValue)
  ) {
    queryString += `ORDER BY ${sortValue} ${orderDirection.toUpperCase()}`;
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }
  //if /api/articles?sort_by=
  else if (sortValue && validSortColumns.includes(sortValue)) {
    queryString += `ORDER BY ${sortValue} DESC`;
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  } 
  //if /api/articles
  else {
    queryString += `ORDER BY created_at DESC`;
    return db.query(queryString);
  }
};

exports.filterArticlesByTopic = (topic) => {
    const validTopicColumns = ["mitch", "cats", "paper"]; //football, cooking and coding for dev data
    if (topic && validTopicColumns.includes(topic)) {
        return db.query(`SELECT * FROM articles WHERE topic = $1`, [topic]).then(({ rows }) => {
          return rows;
        });
      }
}

exports.fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
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
