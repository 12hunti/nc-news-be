const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchUser = () => {
  return db.query(`SELECT * FROM users`);
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({rows}) => {
      return rows[0];
    });
};
