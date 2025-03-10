const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { handleServerErrors } = require("./controllers/errors.controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(handleServerErrors);

module.exports = app;
