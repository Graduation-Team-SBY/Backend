import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { Profile } from "../models/profile";
import { Transaction } from "../models/transaction";
import { Wallet } from "../models/wallet";
import { uploadProfileImage } from "../services/firebase";
import { TopUp } from "../models/topup";
import axios from "axios";
import { startSession } from "mongoose";
import { getDateRange } from "../helpers/dateFormatter";
import { WorkerProfile } from "../models/workerprofile";
export class Controller {
  static async getProfile(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      let data = await Profile.aggregate([
        {
          $match: { userId: user?._id },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $project: { "userData.password": 0 } },
      ]);
      res.status(200).json(data[0]);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async updateProfileClient(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { name, dateOfBirth, address } = req.body;
      const { user } = req;
      const updateProfile = await Profile.findOne({ userId: user?._id });
      if (!updateProfile) {
        throw { name: "NotFound" };
      }
      await session.withTransaction(async () => {
        // if (!req.file) {
        //   throw { name: "ImageNotFound" };
        // }
        if (req.file) {
          updateProfile.profilePicture = await uploadProfileImage(req.file as Express.Multer.File, req.user?._id);
        }
        // if (!profilePictureUrl) {
        //   throw { name: "ImageNotFound" };
        // }
        updateProfile.name = name;
        updateProfile.dateOfBirth = new Date(dateOfBirth);
        updateProfile.address = address;
        updateProfile.updatedAt = new Date();
        await updateProfile.save({ session });
      });

      res.status(200).json({ message: "Successfully updated profile" });
    } catch (err) {
      console.log(err);
      next(err);
    } finally {
      await session.endSession();
    }
  }
  static async updateProfileWorker(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { name, dateOfBirth, address, bio } = req.body;
      const { user } = req;
      const updateProfile = await WorkerProfile.findOne({ userId: user?._id });
      if (!updateProfile) {
        throw { name: "NotFound" };
      }
      await session.withTransaction(async () => {
        if (req.file) {
          const profilePictureUrl = await uploadProfileImage(req.file as Express.Multer.File, req.user?._id);
          updateProfile.profilePicture = profilePictureUrl;
        }
        updateProfile.name = name;
        updateProfile.dateOfBirth = new Date(dateOfBirth);
        updateProfile.address = address;
        updateProfile.bio = bio;
        updateProfile.updatedAt = new Date();
        await updateProfile.save({ session });
      });

      res.status(200).json({ message: "Successfully updated profile" });
    } catch (err) {
      console.log(err);
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async getOrderHistories(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { sort = "asc", filter = "month" } = req.query;
      let dateFilter = {};
      if (filter) {
        const { startDate, endDate } = getDateRange(filter as "week" | "month" | "year");
        dateFilter = {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        };
      }
      const orderHistories = await Transaction.aggregate([
        {
          $match: { clientId: user?._id, ...dateFilter },
        },
        {
          $lookup: {
            from: "profiles",
            foreignField: "userId",
            localField: "clientId",
            as: "profile",
          },
        },
        {
          $unwind: { preserveNullAndEmptyArrays: true, path: "$profile" },
        },
        {
          $lookup: {
            from: "jobs",
            foreignField: "_id",
            localField: "jobId",
            as: "jobDetail",
          },
        },
        {
          $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$jobDetail",
          },
        },
        {
          $lookup: {
            from: "categories",
            foreignField: "_id",
            localField: "jobDetail.categoryId",
            as: "categoryDetail",
          },
        },
        { $unwind: { preserveNullAndEmptyArrays: true, path: "$categoryDetail" } },
        {
          $addFields: {
            "jobDetail.categoryName": "$categoryDetail.name",
          },
        },
        {
          $sort: { createdAt: sort === "desc" ? -1 : 1 },
        },
        {
          $project: {
            categoryDetail: 0,
          },
        },
      ]);
      if (!orderHistories[0]) {
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
      const userWallet = await Wallet.findOne({ userId: user?._id });
      if (!userWallet) {
        throw { name: "NotFound" };
      }
      res.status(200).json(userWallet);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  // static async updateWallet(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
  //   try {
  //     const { user } = req;
  //     const { amount } = req.body;
  //     const updateUserWallet = await Wallet.findOne({ userId: user?._id });
  //     if (!updateUserWallet) {
  //       throw { name: "NotFound" };
  //     }
  //     updateUserWallet.amount = amount;
  //     updateUserWallet.save();
  //     res.status(200).json(updateUserWallet);
  //   } catch (err) {
  //     console.log(err);
  //     next(err);
  //   }
  // }
  static async updateWallet(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { topupId } = req.body;
      
      const topup = await TopUp.findOne({ topupId: topupId });
      if (!topup) {
        throw { name: "NotFound" };
      }
      const base64Server = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64");
      const { data } = await axios({
        method: "get",
        url: `https://api.sandbox.midtrans.com/v2/${topupId}/status`,
        headers: {
          Authorization: `Basic ${base64Server}`,
        },
      });
      if ((data.transaction_status === "capture" || "settlement") && data.status_code === "200") {
        await session.withTransaction(async () => {
          await Wallet.findOneAndUpdate({ userId: req.user?._id }, { $inc: { amount: topup.amount } });
          await topup.updateOne({ status: "paid" });
        });
        res.status(200).json({ message: "TopUp Success" });
      } else {
        throw { name: "TopUpFailed" };
      }
    } catch (err) {
      next(err);
    }
  }
}
