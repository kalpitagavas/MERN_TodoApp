const errorHandling = (err, req, res, next) => {
  console.log("Error caught by error handling");
  console.log("URL:", req.originalUrl);
  console.error("METHOD: ", req.method);
  console.error("STACK TRACK:\n", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
module.exports = errorHandling;
