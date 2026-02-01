const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  // ✅ ALLOW PREFLIGHT REQUESTS
  if (req.method === 'OPTIONS') {
    return next();
  }

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      return next();
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized, token failed'
      });
    }
  }

  return res.status(401).json({
    message: 'Not authorized, no token'
  });
};
