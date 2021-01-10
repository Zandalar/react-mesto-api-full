module.exports.authMiddleware = (req, res, next) => {
  req.user = { _id: '5fd89307afe94c238ca0f6e9' };
  next();
};
