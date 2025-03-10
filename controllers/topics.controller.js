const { fetchTopics } = require("../models/topics.model");

exports.getTopics = (request, response, next) => {
  fetchTopics().then(({ rows }) => {
    response.status(200).send({ topics: rows });
  });
};
