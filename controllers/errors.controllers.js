exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
      }
      next(error);
}

exports.handleServerErrors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "internal server error" });
};
