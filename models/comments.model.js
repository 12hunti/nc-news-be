const db = require("../db/connection");
const { commentData } = require("../db/data/test-data");
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
  //check if author and body are valid data types
  if (typeof author !== "string" || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }
  //check if any unwanted fields
  const validFields = ["author", "body"];
  const receivedFields = Object.keys({ author, body });
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
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({ rows }) => {
      //check if author exists
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "author not found",
        });
      }
      return rows;
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

exports.removeCommentsbyCommentId = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id)
    .then(() => {
      return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
        [comment_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateCommentByCommentId = (comment_id, commentData) => {
  const { inc_votes } = commentData;
  
  

  return checkExists("comments", "comment_id", comment_id).then(() => {
    return db
      .query(
        `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
        [inc_votes, comment_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
