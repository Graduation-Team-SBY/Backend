import { Request, NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { WorkerProfile } from "../models/workerprofile";
import { Review } from "../models/review";
export class Controller {
  static async getWorkerById(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { workerId } = req.params;
      const foundWorker = await WorkerProfile.findById(workerId);
      if (!foundWorker) {
        throw { name: "NotFound" };
      }
      res.status(201).json(foundWorker);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getWorkerReviews(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { workerId } = req.params;
      const foundWorker = await WorkerProfile.findById(workerId);
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
            "transaction.workerId": workerId,
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
