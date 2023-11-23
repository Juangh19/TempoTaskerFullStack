import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePasswords, hashPassword } from '../utils/passwordUtils.js';
import { createJWT } from '../utils/tokenUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ username, email, password: hashedPassword });
  res.status(StatusCodes.CREATED).json({ msg: 'User created' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('invalid credentials');
  }

  const isValidUser = await comparePasswords(password, user.password);

  if (!isValidUser) {
    throw new UnauthenticatedError('invalid credentials');
  }

  const token = createJWT({ userID: user._id });

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.OK).json({ msg: 'Login route' });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(StatusCodes.OK).json({ msg: 'Logout route' });
};
