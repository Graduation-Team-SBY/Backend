import { Response, Request, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import { Error } from 'mongoose';

export const errorHandler = (
  err: Error & Error.ValidationError & MongoServerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message = 'Internal Server Error';

  if (err.errorResponse?.code === 11000) {
    status = 400;
    const field = Object.keys(err.errorResponse.keyPattern)[0]
    message = `${field.replace(field[0], field[0].toUpperCase())} already exist!`
  }

  switch (err.name as string) {
    case 'ValidationError':
      status = 400;
      message = err.errors[Object.keys(err.errors)[0]].message;
      break;
    case 'EmailRequired':
      status = 400;
      message = 'Please input your email!'
      break;
    case 'PasswordRequired':
      status = 400;
      message = 'Please input your password!';
      break;
    case 'Unauthorized':
      status = 401;
      message = 'Invalid email/password';
      break;
    case 'Unauthenticated':
      status = 401;
      message = 'Invalid access token';
      break;
    case 'Forbidden':
      status = 403;
      message = 'Insufficient privileges to do this action';
      break;
    case 'WorkerPicked':
      status = 400;
      message = 'You already picked a worker before';
      break;
    case 'NotConfirmed':
      status = 400;
      message = 'Worker haven\'t confirmed yet';
      break;
    case 'ProfileRequired':
      status = 400;
      message = 'Fill in your profile first!';
      break;
    case 'NotFound':
      status = 404;
      message = 'Data Not Found!';
      break;
    case 'JsonWebTokenError':
      status = 401;
      message = 'Invalid access token';
      break;
    case 'NotEnoughMoney':
      status = 400;
      message = 'You don\'t have enough money!';
      break;
    case 'CannotCancel':
      status = 403;
      message = 'You cannot cancel this job order!';
      break;
    case 'ImageNotFound':
      status = 400;
      message = 'Failed to upload image, please try again!';
      break;
    case 'RatingNotNull':
      status = 400;
      message = 'Please input the rating!';
      break;
  }
  console.log(err);
  res.status(status).json({ message });
};
