const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }


  // const user = await User.findOne({ email }).select('+password');
  const user = await User.findOne({ 
    where: { email } 
  });


    
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }


  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }


  // user.lastLogin = Date.now();
  // await user.save({ validateBeforeSave: false });
  user.lastLogin = new Date();
  await user.save();

  // 5) If everything ok, send token to clien
  createSendToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;


  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password!', 400));
  }


  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new AppError('Email already in use!', 400));
  }


  const newUser = await User.create({
    name,
    email,
    password,
    role 
  });


  createSendToken(newUser, 201, res);
  
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
