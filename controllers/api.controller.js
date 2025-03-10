const endpoints = require("../endpoints.json");

exports.getApi = (request, response) => {
  response.send({ endpoints });
};
