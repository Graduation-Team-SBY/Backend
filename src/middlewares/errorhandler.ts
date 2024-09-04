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

  switch (err.name) {
    case 'ValidationError':
      status = 400;
      message = err.errors[Object.keys(err.errors)[0]].message;
      break;
  }
  res.status(status).json({ message });
};
