const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router")
const articlesRouter = require("./articles-router")

const { getApi } = require("../controllers/api.controller");

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.get("/", getApi)

module.exports = {apiRouter}


