const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router")

const { getApi } = require("../controllers/api.controller");

apiRouter.use('/topics', topicsRouter)

apiRouter.get("/", getApi)

module.exports = {apiRouter}

//seperate files (subrouters) for each table and require into this file
