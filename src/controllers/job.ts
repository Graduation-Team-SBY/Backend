import { NextFunction, Request, Response } from "express";
import { Job } from "../models/job";
import { ObjectId } from "mongodb";
import { uploadImageFiles } from "../services/firebase";
import { startSession } from "mongoose";
import { AuthRequest } from "../types";
import { JobRequest } from "../models/jobrequest";
import { JobStatus } from "../models/jobstatus";

export class Controller {
  static async createJobBersih(req: AuthRequest, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const { fee, categoryId, description, address } = req.body;
      const newJob = new Job({
        description: description,
        address: address,
        fee: Number(fee),
        categoryId: new ObjectId(categoryId),
        clientId: req.user?._id,
      });
      await session.withTransaction(async () => {
        await newJob.save({session});
        if (!req.files) {
          throw {name: 'ImageNotFound'}
        }
        if (!req.files.length){
          throw {name: 'ImageNotFound'}
        }
        const filesUrl = await uploadImageFiles(req.files as Express.Multer.File[], req.user?._id);
        if (!filesUrl) {
          throw {name: 'ImageNotFound'}
        }
        if (!filesUrl.length){
          throw {name: 'ImageNotFound'}
        }
        await Job.updateOne({_id: newJob._id}, { images: filesUrl }, { session });
      });
      res.status(201).json({ message: "Job is successfully created!" });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async createJobBelanja(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { fee, categoryId, description, address } = req.body;
      const newJob = new Job({
        description: description,
        address: address,
        fee: Number(fee),
        categoryId: new ObjectId(categoryId),
        clientId: req.user?._id,
      });
      await newJob.save();
      res.status(201).json({ message: "Job is successfully created!" });
    } catch (err) {
      next(err);
    }
  }

  static async activeJobsClient(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.query;
      const query: { clientId: ObjectId, categoryId?: ObjectId } = {
        clientId: req.user?._id as ObjectId
      }
      if (categoryId) {
        query.categoryId = new ObjectId(categoryId as string)
      }
      const jobs = await Job.find(query).sort({ createdAt: -1 });
      res.status(200).json(jobs);
    } catch (err) {
      next(err);
    }
  }

  static async allJobsWorker(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.query;
      const query: { categoryId?: ObjectId } = {}
      if (categoryId) {
        query.categoryId = new ObjectId(categoryId as string)
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
      const { jobId } = req.params;
      const newJobReq = new JobRequest({
        jobId: new ObjectId(jobId),
        workerId: req.user?._id
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
          '$match': {
            '_id': new ObjectId(jobId)
          }
        }, {
          '$lookup': {
            'from': 'jobrequests', 
            'localField': '_id', 
            'foreignField': 'jobId', 
            'as': 'workers'
          }
        }, {
          '$lookup': {
            'from': 'workerprofiles', 
            'localField': 'workers.workerId', 
            'foreignField': 'userId', 
            'as': 'workers',
            'pipeline': [
              {
                '$lookup': {
                  'from': 'profiles', 
                  'localField': 'userId', 
                  'foreignField': 'userId', 
                  'as': 'detail'
                }
              }, {
                '$project': {
                  'detail.dateOfBirth': 0, 
                  'detail.address': 0
                }
              }, {
                '$unwind': {
                  'path': '$detail', 
                  'preserveNullAndEmptyArrays': true
                }
              }
            ]
          }
        }
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
        throw {name: 'WorkerPicked'}
      }
      await session.withTransaction(async () => {
        await Job.updateOne({_id: objIdJob}, {workerId: new ObjectId(workerId)}, { session });
        const newJobStatus = new JobStatus({
          jobId: objIdJob
        });
        await newJobStatus.save({session});
      });
      res.status(200).json({message: 'Successfully picked worker'});
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  }

  static async workerConfirm(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      await JobStatus.updateOne({ jobId: new ObjectId(jobId) }, { isWorkerConfirmed: true });
      res.status(200).json({message: 'Successfully update job status'});
    } catch (err) {
      next(err);
    }
  }

  static async clientConfirm(req: Request, res: Response, next: NextFunction) {
    // const session = await startSession();
    try {
      const { jobId } = req.params;
      const findJob = await JobStatus.findOne({  jobId: new ObjectId(jobId) });
      if (findJob?.isWorkerConfirmed === false) {
        throw {name: 'NotConfirmed'};
      }
      // await session.withTransaction(async () => {})
      await findJob?.updateOne({ isClientConfirmed: true, isDone: true });
      res.status(200).json({message: 'Successfully update job order status'});
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
