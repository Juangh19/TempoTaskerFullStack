import { body, param, validationResult } from 'express-validator';
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  UnauthenticatedError,
} from '../errors/customErrors.js';
import User from '../models/UserModel.js';

const withValidationError = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorsMessages);
      }
      next();
    },
  ];
};

export const validateTaskInput = withValidationError([
  body('name').notEmpty().withMessage('Task name is required'),
  body('duration')
    .notEmpty()
    .withMessage('Task duration is required')
    .isNumeric()
    .withMessage('Task duration must be a number'),
]);

export const validateIDParam = withValidationError([
  param('id').isMongoId().withMessage('ID param must be a valid MongoDB ID'),
]);

export const validateRegisterInput = withValidationError([
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid')
    .custom(async (value) => {
      const sameEmail = await User.findOne({ email: value });
      if (sameEmail) {
        throw new BadRequestError('Email already in use');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new BadRequestError('Passwords must match');
      }
      return true;
    }),
]);

export const validateLoginInput = withValidationError([
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password').notEmpty().withMessage('Password is required'),
]);
