const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Error('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    next(new Error('Необходима авторизация'));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
