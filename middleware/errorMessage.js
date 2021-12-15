const errorTypes = {
  SequelizeValidationError: 422,
  ValidationError: 422,
};

const notFound = (req, res, next) => {
  const err = new Error(
    `The resource requested could not be found on this server - ${req.originalUrl}`
  );
  res.status(404);
  next(err);
};

const errorHandlers = (error, req, res, next) => {
  const statusCode =
    res.statusCode === 200 ? errorTypes[error.name] || 500 : res.statusCode;

  res.status(statusCode);
  res.send({
    status: statusCode,
    message: error.message,
    error:
      process.env.NODE_ENV === "production"
        ? "Production mode already started..."
        : error.stack,
    errors: error || undefined,
  });
};

module.exports = {
  notFound,
  errorHandlers,
};
