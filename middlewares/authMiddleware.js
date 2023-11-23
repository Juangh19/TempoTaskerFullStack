import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new UnauthenticatedError('Authentication invalid');

  try {
    const { userID } = verifyJWT(token);
    req.user = { userID };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication failed');
  }
};
