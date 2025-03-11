const { fetchUser } = require("../models/users.model");

exports.getUsers = (require, response, next) => {
  fetchUser()
    .then(({ rows }) => {
      response.status(200).send({ users: rows });
    })
    .catch((err) => {
      next(err);
    });
};
