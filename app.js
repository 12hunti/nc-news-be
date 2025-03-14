const express = require("express");
const app = express();
const { apiRouter } = require("./routes/api-router");

const {
  deleteCommentByCommentId,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

app.use(express.json());

app.use("/api", apiRouter);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/users", getUsers);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
