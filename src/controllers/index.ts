import { Request, Response, NextFunction } from 'express';
import { IUserSchema } from '../types';
import { User } from '../models/user';
import { comparePass, hashPassword } from '../helpers/bcrypt';
import { signToken } from '../helpers/jwt';

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

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: 'EmailRequired' };
      }
      if (!password) {
        throw { name: 'PasswordRequired' };
      }

      const findUser = await User.findOne({ email }).select(
        '_id email password'
      );

      if (!findUser) {
        throw { name: 'Unauthorized' };
      }

      if (!comparePass(password, findUser.password)) {
        throw { name: 'Unauthorized' };
      }

      const access_token = signToken({ _id: `${findUser._id}` });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  }

  // static async template(req: Request, res: Response, next: NextFunction) {
  //   try {

  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // static async template(req: Request, res: Response, next: NextFunction) {
  //   try {

  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // static async template(req: Request, res: Response, next: NextFunction) {
  //   try {

  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // static async template(req: Request, res: Response, next: NextFunction) {
  //   try {

  //   } catch (err) {
  //     next(err);
  //   }
  // }
}
