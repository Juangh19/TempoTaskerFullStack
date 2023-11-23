import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userID);
  res.status(StatusCodes.OK).json({ user });
};
