const db = require("../db/connection");

exports.fetchArticles = () => {
  return db.query(`SELECT * FROM articles ORDER BY created_at DESC`);
};

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

//could refactor into one function query builder thing

exports.updateArticleByID = (article_id, inc_votes) => {
    return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id]).then(({rows}) => {
        return rows[0]
    })
};
