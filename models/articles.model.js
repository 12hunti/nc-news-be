const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchArticles = (sortValue, orderValue) => {
  const validSortColumns = ["created_at", "votes", "author", "topic", "title"];
  const validOrderColumns = ["asc", "desc"];

  let queryString = `SELECT * FROM articles `;
  let queryParams = [];
  

    console.log(sortValue, orderValue, "sortValue and orderValue in model")

    //console.log(orderValue.toUpperCase(), "orderValue uppercase in model")

    

  //if not an allowed input send an error
  if (sortValue && !validSortColumns.includes(sortValue)) {
    return Promise.reject({ status: 400, msg: "invalid sort by value" });
  }

  if(sortValue && validSortColumns.includes(sortValue) && orderValue === 'desc'){
    queryString += `ORDER BY ${sortValue} DESC `
        return db.query(queryString).then(({ rows }) => {
            return rows
    })
  }

  if(sortValue && validSortColumns.includes(sortValue) && orderValue === 'asc'){
    queryString += `ORDER BY ${sortValue} ASC `
        return db.query(queryString).then(({ rows }) => {
            return rows
    })
  }

  //if allowed input sort by that value
  if (sortValue && validSortColumns.includes(sortValue)) {
        queryString += `ORDER BY ${sortValue} DESC`;
        return db.query(queryString).then(({ rows }) => {
          return rows;
    
});
}

  //if /api/articles
  else {
    queryString += `ORDER BY created_at DESC`;
    return db.query(queryString, queryParams);
  }
};

//if /api/articles/:article_id
//   if (article_id) {
//     queryParams.push(article_id);
//     queryString += `WHERE article_id = $1 `;

//     return checkExists("articles", "article_id", article_id).then(() => {
//       queryString += `ORDER BY created_at DESC `;
//       return db.query(queryString, queryParams).then(({ rows }) => {
//         return rows[0];
//       });
//     });
//   }

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

//check if any unwanted fields
