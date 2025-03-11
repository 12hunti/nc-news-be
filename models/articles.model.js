const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchArticles = (article_id) => {
    let queryString = `SELECT * FROM articles `;
    const queryParams = [];
  
    if (article_id) {
      queryParams.push(article_id);
      queryString += `WHERE article_id = $1 `;
  
    return checkExists("articles", "article_id", article_id).then(() => {
      queryString += `ORDER BY created_at DESC`;
      return db.query(queryString, queryParams).
      then(({ rows }) => {
        return rows[0] });
    })
  } else {
      queryString += `ORDER BY created_at DESC`
      return db.query(queryString, queryParams)
  }
    ;
  };

//could refactor into one function query builder thing

exports.updateArticleByID = (article_id, articleData) => {
    const {inc_votes} = articleData
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
        return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id]).then(({rows}) => {

        
            return rows[0]
        })
    })
};

 //check if any unwanted fields
 