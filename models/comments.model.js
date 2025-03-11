const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

const fetchCommentsByArticleId = (article_id) => {
  return db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
    [article_id]
  ).then (({rows}) => {
      if (!rows.length) {
        return checkExists("articles", "article_id", article_id).then(() => {
            return []
        })
      }
      return rows
  })
};

module.exports = { fetchCommentsByArticleId };
