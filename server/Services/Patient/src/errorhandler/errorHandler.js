// errorHandler.js
module.exports = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      // Only expose stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  