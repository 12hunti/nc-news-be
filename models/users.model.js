const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchUser = () => {
  return db.query(`SELECT * FROM users`);
};
