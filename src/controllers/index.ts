import { Request, Response, NextFunction } from "express";
import { IUserSchema } from "../types";
import { User } from "../models/user";
import { comparePass, hashPassword } from "../helpers/bcrypt";
import { signToken } from "../helpers/jwt";
import { startSession } from "mongoose";
import { Profile } from "../models/profile";
import { Wallet } from "../models/wallet";
import { WorkerProfile } from "../models/workerprofile";

export default class Controller {
  static async clientRegister(req: Request, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { email, phoneNumber, password }: IUserSchema = req.body;
      const newUser = new User({
        email,
        phoneNumber,
        password,
        role: 'client'
      });
      await session.withTransaction(async() => {
        await newUser.validate();
        newUser.password = hashPassword(password);
        await newUser.save({ session });
        const newProfile = new Profile({
          userId: newUser._id
        });
        await newProfile.save();
        const newWallet = new Wallet({
          userId: newUser._id
        });
        await newWallet.save({ session });
        res.status(201).json(newUser);
      });
    } catch (err) {
      next(err);
    } finally {
      session.endSession();
    }
  }

  static async workerRegister(req: Request, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { email, phoneNumber, password }: IUserSchema = req.body;
      const newUser = new User({
        email,
        phoneNumber,
        password,
        role: 'worker'
      });
      await session.withTransaction(async() => {
        await newUser.validate();
        newUser.password = hashPassword(password);
        await newUser.save({ session });
        const newWorkerProfile = new WorkerProfile({
          userId: newUser._id
        });
        await newWorkerProfile.save();
        const newWallet = new Wallet({
          userId: newUser._id
        });
        await newWallet.save({ session });
        res.status(201).json(newUser);
      });
    } catch (err) {
      next(err);
    } finally {
      session.endSession();
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "EmailRequired" };
      }
      if (!password) {
        throw { name: "PasswordRequired" };
      }

      const findUser = await User.findOne({ email }).select("_id email password");

      if (!findUser) {
        throw { name: "Unauthorized" };
      }

      if (!comparePass(password, findUser.password)) {
        throw { name: "Unauthorized" };
      }

      const access_token = signToken({ _id: `${findUser._id}` });
      res.status(200).json({ access_token, role: findUser.role });
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
}
