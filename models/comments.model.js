const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return checkExists("articles", "article_id", article_id).then(() => {
          return [];
        });
      }
      return rows;
    });
};

exports.insertCommentsByArticleId = (author, body, article_id) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [author]).then(({rows}) => {
        if(!rows[0]){
            return Promise.reject({
                status: 404,
                msg: "author not found"
            })
        }
        return rows
    })
    .then(() => {
      return db.query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
        [author, body, article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
