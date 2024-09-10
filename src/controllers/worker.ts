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
      const agg = [
        {
          '$lookup': {
            'from': 'jobs', 
            'localField': 'jobId', 
            'foreignField': '_id', 
            'as': 'job'
          }
        }, {
          '$unwind': {
            'path': '$job', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'profiles', 
            'localField': 'job.clientId', 
            'foreignField': 'userId', 
            'as': 'client'
          }
        }, {
          '$unwind': {
            'path': '$client', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'categories', 
            'localField': 'job.categoryId', 
            'foreignField': '_id', 
            'as': 'category'
          }
        }, {
          '$unwind': {
            'path': '$category', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'job': {
              'description': 0, 
              'address': 0, 
              'fee': 0, 
              'images': 0, 
              'chatId': 0, 
              'coordinates': 0, 
              'addressNotes': 0
            }, 
            'client': {
              'dateOfBirth': 0, 
              'address': 0
            }
          }
        }, {
          '$match': {
            'job.workerId': req.user?._id
          }
        }, {
          '$project': {
            'job': 0
          }
        }
      ];
      const reviews = await Review.aggregate(agg).sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getBestYasa(req: Request, res: Response, next: NextFunction) {
    try {
      const agg = [
        {
          '$project': {
            'address': 0, 
            'dateOfBirth': 0
          }
        }, {
          '$limit': 5
        }
      ];

      const data = await WorkerProfile.aggregate(agg).sort({ rating: -1 });
      res.status(200).json(data);
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
}
