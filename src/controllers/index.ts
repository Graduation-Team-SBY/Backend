import { Request, Response, NextFunction } from 'express';
import { IUserSchema } from '../types';
import { User } from '../models/user';
import { hashPassword } from '../helpers/bcrypt';

export default class Controller {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phoneNumber, password }: IUserSchema = req.body;

      const newUser = new User({
        email,
        phoneNumber,
        password,
      });
      await newUser.validate();
      newUser.password = hashPassword(password);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
}
