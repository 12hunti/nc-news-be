const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchUser = () => {
  return db.query(`SELECT * FROM users`);
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({rows}) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "username not found",
        });
      }
      return rows[0];
    });
};
