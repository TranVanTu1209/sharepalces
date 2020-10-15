const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
  let users;
  try
  {
    users = await User.find({}, '-password');
  } catch (error)
  {
    return next(new HttpError('Server error', 500));
  }
  return res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return next(new HttpError('Invalid credentials. Please try again', 422));
  }
  const { email, password } = req.body;
  let user;
  try
  {
    user = await User.findOne({ email });
  } catch (error)
  {
    const err = new HttpError('Server error.Some thing went wrong!!!', 500);
    return next(err);
  }
  if (!user)
  {
    return next(new HttpError('Could not find user. Please try again!', 404));
  }
  let isValidPassword = false;
  try
  {
    isValidPassword = await bcryptjs.compare(password, user.password);
  } catch (error)
  {
    return next(new HttpError('Could not log you in. Please check your credentials and try again!', 403));
  }
  if (!isValidPassword)
  {
    return next(new HttpError('Please check your credentials and try again!', 403));
  }
  let token;
  try
  {
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  } catch (error)
  {
    const err = new HttpError('Loging in failed.Please try again', 403);
    return next(err);
  }

  return res.json({
    token: token,
    userId: user._id
  });
}

const signup = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty())
  {
    return next(new HttpError('Invalid credentials. Please try again', 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try
  {
    existingUser = await User.findOne({ email });
  } catch (error)
  {
    console.log(error);
    const err = new HttpError('Server error.Some thing went wrong!!!', 500);
    return next(err);
  }

  if (existingUser)
  {
    const err = new HttpError('User with that email already exist.Please login instead', 422);
    return next(err);
  }
  let hashPassword;
  try
  {
    hashPassword = await bcryptjs.hash(password, 12);
  } catch (error)
  {
    return new HttpError('Can not create user', 500);
  }
  const newUser = new User({
    name,
    email,
    password: hashPassword,
    image: req.file.path,
    places: []
  });

  try
  {
    await newUser.save();
  } catch (error)
  {
    const err = new HttpError('Signing up failed.Please try again', 403);
    return next(err);
  }
  let token;
  try
  {
    token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  } catch (error)
  {
    const err = new HttpError('Signing up failed.Please try again', 403);
    return next(err);
  }
  return res.status(201).json({
    userId: newUser._id,
    token: token
  });
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;