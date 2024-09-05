import { NextFunction, Request, Response } from "express";
import { Job } from "../models/job";
import { JobStatus } from "../models/jobstatus";
import { ObjectId } from "mongodb";
import { startSession } from "mongoose";
import { uploadImageFiles } from "../services/firebase";

export class Controller {
  static async createJob(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const filesUrl = await uploadImageFiles(req.files as Express.Multer.File[], req.user?._id);
      const newJob = new Job({
        images: filesUrl,
        description: "testing bikin job",
        address: "jalan jalan ke taman ria",
        fee: 50000,
        categoryId: "test",
        workerId: "test",
        clientId: req.user?._id,
      });
      await session.withTransaction(async () => {
        await newJob.save({ session });
        const newJobStatus = new JobStatus({
          jobId: newJob._id,
        });
        await newJobStatus.save({ session });
        res.status(201).json({ message: "Job is successfully created!" });
      });
    } catch (err) {
      next(err);
    } finally {
      session.endSession();
    }
  }
}
