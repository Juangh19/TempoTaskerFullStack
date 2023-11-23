export const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  console.log(1);
  const message = err.message || 'Internal server error';
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ msg: message });
};
