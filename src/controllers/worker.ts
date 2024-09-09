import { Request, NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { WorkerProfile } from "../models/workerprofile";
import { Review } from "../models/review";
import { AuthRequest } from "../types";
export class Controller {
  static async getWorkerById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const foundWorker = await WorkerProfile.aggregate([
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
      if (!foundWorker[0]) {
        throw { name: "NotFound" };
      }
      res.status(200).json(foundWorker[0]);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getWorkerReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const foundWorker = await WorkerProfile.findOne({ userId: user?._id });
      if (!foundWorker) {
        throw { name: "NotFound" };
      }
      const reviews = await Review.aggregate([
        {
          $lookup: {
            from: "transactions",
            localField: "transactionId",
            foreignField: "_id",
            as: "transaction",
          },
        },
        {
          $unwind: "$transaction",
        },
        {
          $match: {
            "transaction.workerId": foundWorker._id,
          },
        },
        {
          $lookup: {
            from: "workers",
            localField: "transaction.workerId",
            foreignField: "_id",
            as: "worker",
          },
        },
        {
          $unwind: "$worker",
        },
        {
          $project: {
            _id: 1,
            description: 1,
            rating: 1,
            images: 1,
            "worker.bio": 1,
            "worker.joinDate": 1,
            "worker.rating": 1,
          },
        },
      ]);
      res.status(200).json(reviews);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
