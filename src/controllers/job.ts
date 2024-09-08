import { NextFunction, Request, Response } from "express";
import { Job } from "../models/job";
import { ObjectId } from "mongodb";
import { uploadImageFiles, uploadWorkerConfirm } from "../services/firebase";
import { SortOrder, startSession } from "mongoose";
import { AuthRequest } from "../types";
import { JobRequest } from "../models/jobrequest";
import { JobStatus } from "../models/jobstatus";
import { Transaction } from "../models/transaction";
import { profileChecker, profileWorkerChecker } from "../helpers/profilechecker";
import { Wallet } from "../models/wallet";

export class Controller {
  static async createJobBersih(req: AuthRequest, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      await profileChecker(req.user?._id as ObjectId);
      const { fee, description, address } = req.body;
      const newJob = new Job({
        description: description,
        address: address,
        fee: Number(fee),
        categoryId: new ObjectId("66d97dfec793c4c4de7c2db0"),
        clientId: req.user?._id,
      });
      await session.withTransaction(async () => {
        const wallet = await Wallet.findOne({ userId: req.user?._id }, {} , { session });
        if (wallet?.amount as number >= fee) {
          await wallet?.updateOne({ $inc: { amount: -(Number(fee)) } }, { session });
        } else {
          throw {name: 'NotEnoughMoney'};
        }
        await newJob.save({ session });
        if (!req.files) {
          throw { name: "ImageNotFound" };
        }
        if (!req.files.length) {
          throw { name: "ImageNotFound" };
        }
        const filesUrl = await uploadImageFiles(req.files as Express.Multer.File[], req.user?._id, newJob?._id);
        if (!filesUrl) {
          throw { name: "ImageNotFound" };
        }
        if (!filesUrl.length) {
          throw { name: "ImageNotFound" };
        }
        await Job.updateOne({ _id: newJob._id }, { images: filesUrl }, { session });
      });
      res.status(201).json({ message: "Job is successfully created!" });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async createJobBelanja(req: AuthRequest, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      await profileChecker(req.user?._id as ObjectId);
      const { fee, description, address } = req.body;
      const newJob = new Job({
        description: description,
        address: address,
        fee: Number(fee),
        categoryId: new ObjectId("66d97e7518cd9c2062da3d98"),
        clientId: req.user?._id,
      });
      await session.withTransaction(async () => {
        const wallet = await Wallet.findOne({ userId: req.user?._id }, {} , { session });
        if (wallet?.amount as number >= fee) {
          await wallet?.updateOne({ $inc: { amount: -(Number(fee)) } }, { session });
        } else {
          throw {name: 'NotEnoughMoney'};
        }
        await newJob.save({ session });
      });
      res.status(201).json({ message: "Job is successfully created!" });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async activeJobsClient(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { category , sort } = req.query;

      let sortOrder = -1;
      if (sort === 'asc') {
        sortOrder = 1;
      }
      if ( sort === 'desc' ) {
        sortOrder = -1;
      }

      const agg : any = [
        {
          '$match' : {
            'clientId': req.user?._id
          }
        }, {
          '$lookup': {
            'from': 'categories', 
            'localField': 'categoryId', 
            'foreignField': '_id', 
            'as': 'category'
          }
        }, {
          '$lookup': {
            'from': 'jobstatuses', 
            'localField': '_id', 
            'foreignField': 'jobId', 
            'as': 'status'
          }
        }, {
          '$unwind': {
            'path': '$status', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            '$or': [
              {
                'status.isDone': false
              }, {
                'status': null
              }
            ]
          }
        }
      ];

      if (category) {
        agg.push({
          '$match' : {
            'category.name': category
          }
        })
      }

      const jobs = await Job.aggregate(agg).unwind('category').sort({ createdAt: sortOrder as SortOrder })
      res.status(200).json(jobs);
    } catch (err) {
      next(err);
    }
  }

  static async allJobsWorker(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.query;
      const query: { categoryId?: ObjectId; workerId: null } = { workerId: null };
      if (categoryId) {
        query.categoryId = new ObjectId(categoryId as string);
      }
      const jobs = await Job.find(query).sort({ createdAt: -1 });
      res.status(200).json(jobs);
    } catch (err) {
      next(err);
    }
  }

  static async jobDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const job = await Job.findById(new ObjectId(jobId));
      res.status(200).json(job);
    } catch (err) {
      next(err);
    }
  }

  static async applyJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await profileWorkerChecker(req.user?._id as ObjectId);
      const { jobId } = req.params;
      const newJobReq = new JobRequest({
        jobId: new ObjectId(jobId),
        workerId: req.user?._id,
      });
      await newJobReq.save();
      res.status(201).json(newJobReq);
    } catch (err) {
      next(err);
    }
  }

  static async getWorkerList(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const agg = [
        {
          $match: {
            _id: new ObjectId(jobId),
          },
        },
        {
          $lookup: {
            from: "jobrequests",
            localField: "_id",
            foreignField: "jobId",
            as: "workers",
          },
        },
        {
          $lookup: {
            from: "workerprofiles",
            localField: "workers.workerId",
            foreignField: "userId",
            as: "workers",
            pipeline: [
              {
                $lookup: {
                  from: "profiles",
                  localField: "userId",
                  foreignField: "userId",
                  as: "detail",
                },
              },
              {
                $project: {
                  "detail.dateOfBirth": 0,
                  "detail.address": 0,
                },
              },
              {
                $unwind: {
                  path: "$detail",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
      ];
      const workers = await Job.aggregate(agg);
      res.status(200).json(workers[0]);
    } catch (err) {
      next(err);
    }
  }

  static async pickWorker(req: AuthRequest, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { jobId, workerId } = req.params;
      const objIdJob = new ObjectId(jobId);
      const job = await Job.findById(objIdJob);
      if (job?.workerId !== null) {
        throw { name: "WorkerPicked" };
      }
      await session.withTransaction(async () => {
        await Job.updateOne({ _id: objIdJob }, { workerId: new ObjectId(workerId) }, { session });
        const newJobStatus = new JobStatus({
          jobId: objIdJob,
        });
        await newJobStatus.save({ session });
      });
      res.status(200).json({ message: "Successfully picked worker" });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async workerConfirm(req: AuthRequest, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { jobId } = req.params;
      const updateJobStat = await JobStatus.findOne({ jobId: new ObjectId(jobId) });
      if (!updateJobStat) {
        throw { name: "NotFound" };
      }
      await session.withTransaction(async () => {
        if (!req.files) {
          throw { name: "ImageNotFound" };
        }
        if (!req.files.length) {
          throw { name: "ImageNotFound" };
        }
        const filesUrl = await uploadWorkerConfirm(req.files as Express.Multer.File[], req.user?._id, new ObjectId(jobId));
        if (!filesUrl) {
          throw { name: "ImageNotFound" };
        }
        if (!filesUrl.length) {
          throw { name: "ImageNotFound" };
        }
        updateJobStat.isWorkerConfirmed = true;
        await updateJobStat.save({ session });
      });
      res.status(200).json({ message: "Successfully update job status" });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async clientConfirm(req: AuthRequest, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { jobId } = req.params;
      const objJobId = new ObjectId(jobId);
      const findJobStatus = await JobStatus.findOne({ jobId: objJobId });
      if (findJobStatus?.isWorkerConfirmed === false) {
        throw { name: "NotConfirmed" };
      }
      await session.withTransaction(async () => {
        await findJobStatus?.updateOne({ isClientConfirmed: true, isDone: true }, { session });
        const job = await Job.findById(objJobId, "_id clientId workerId");
        const newTransaction = new Transaction({
          clientId: job?.clientId,
          workerId: job?.workerId,
          jobId: objJobId,
        });
        await Wallet.findOneAndUpdate({ userId: job?.workerId }, { $inc: { amount: job?.fee } });
        await newTransaction.save({ session });
      });
      res.status(200).json({ message: "Successfully update job order status" });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async getChatByJobId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;

      const chats = await Job.aggregate([
        {
          $match: {
            _id: new ObjectId(jobId),
          },
        },
        {
          $lookup: {
            from: "chats",
            localField: "chatId",
            foreignField: "_id",
            as: "chat",
          },
        },
        {
          $unwind: {
            path: "$chat",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            description: 1,
            address: 1,
            fee: 1,
            images: 1,
            clientId: 1,
            workerId: 1,
            categoryId: 1,
            "chat._id": 1,
            "chat.contents": 1,
          },
        },
      ]);

      if (!chats[0]) {
        throw { name: "NotFound" };
      }
      res.status(200).json(chats[0].chat.content);
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
