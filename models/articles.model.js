const db = require("../db/connection")

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        if(!rows[0]){
            return Promise.reject({
                status: 404,
                msg: "article_id not found"
            })
        }
        return rows[0]
    })
}