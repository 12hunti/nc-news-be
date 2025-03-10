const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "path not found" });
});

app.use(handleServerErrors);

module.exports = app;
