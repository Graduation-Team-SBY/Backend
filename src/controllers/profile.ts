import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { Profile } from "../models/profile";
import { Transaction } from "../models/transaction";
import { Wallet } from "../models/wallet";
import { uploadSingleImage } from "../services/firebase";
export class Controller {
  static async getProfile(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await Profile.findOne({ userId: user?._id });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async updateProfile(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { name, dateOfBirth, address } = req.body;
      const { user } = req;
      console.log(req.user?._id);
      // const profiles = await Profile.find();
      // console.log(profiles);
      const updateProfile = await Profile.findOne({ userId: user?._id });
      if (!updateProfile) {
        throw { name: "NotFound" };
      }
      const profilePicture = await uploadSingleImage(req.file as Express.Multer.File, req.user?._id);
      updateProfile.name = name;
      updateProfile.dateOfBirth = new Date();
      updateProfile.profilePicture = profilePicture;
      updateProfile.address = address;
      updateProfile.save();
      res.status(200).json(updateProfile);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getOrderHistories(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const orderHistories = await Transaction.find({ clientId: user?._id });
      if (!orderHistories) {
        throw { name: "NotFound" };
      }
      res.status(200).json(orderHistories);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getWallet(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const userWallet = await Wallet.find({ userId: user?._id });
      if (!userWallet) {
        throw { name: "NotFound" };
      }
      res.status(200).json(userWallet);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async updateWallet(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { amount } = req.body;
      const updateUserWallet = await Wallet.findOne({ userId: user?._id });
      if (!updateUserWallet) {
        throw { name: "NotFound" };
      }
      updateUserWallet.amount = amount;
      updateUserWallet.save();
      res.status(200).json(updateUserWallet);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
