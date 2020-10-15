const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS')
  {
    return next();
  }
  let token = req.headers.authorization;
  if (token)
  {
    try
    {
      token = token.trim().replace('Bearer ', '');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = { userId: decodedToken.userId };
      next();
    } catch (error)
    {
      return next(new HttpError('Token is invalid. Authorization failed', 401));
    }
  } else
  {
    return next(new HttpError('No token is provided. Authorization failed', 401));
  }
}