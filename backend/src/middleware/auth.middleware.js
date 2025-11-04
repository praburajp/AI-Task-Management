const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized to access this route', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      throw new AppError('User not found', 401);
    }

    next();
  } catch (error) {
    throw new AppError('Not authorized to access this route', 401);
  }
});