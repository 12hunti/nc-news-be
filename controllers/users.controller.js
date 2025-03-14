const { fetchUser, fetchUserByUsername } = require("../models/users.model");

exports.getUsers = (request, response, next) => {
  fetchUser()
    .then(({ rows }) => {
      response.status(200).send({ users: rows });
    })
};

exports.getUsersByUsername = (request, response, next) => {
  const {username} = request.params
  fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
  })
  .catch((err) => {
    next(err)
  });
};
