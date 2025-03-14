const apiRouter = require("express").Router();

const {getApi} = require("./controllers/api.controller")


// apiRouter.get("/", (req, res) => {
//   res.status(200).send("All OK from /api");
// })

apiRouter.get("/", getApi) 

//in app.js app.get("api", apiRouter) and require in function

module.exports = apiRouter

//seperate files (subrouters) for each table and require into this file 