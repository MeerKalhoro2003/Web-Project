module.exports = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Resource not found - ${req.originalUrl}`
    }
  });
};
