exports.handleServerErrors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "internal server error" });
};
