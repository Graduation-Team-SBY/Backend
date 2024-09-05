import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { Profile } from "../models/profile";
import { User } from "../models/user";
export class Controller {
  static async getProfile(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const data = await Profile.findOne({ userId: user?._id });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  }

  static async updateProfile(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { name, dateOfBirth, profilePicture, address } = req.body;
      const { user } = req;
    } catch (err) {
      console.log(err);
    }
  }
}
