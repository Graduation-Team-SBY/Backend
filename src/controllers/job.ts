import { NextFunction, Request, Response } from "express";
import { Job } from "../models/job";
import { JobStatus } from "../models/jobstatus";
import { ObjectId } from "mongodb";
import { startSession } from "mongoose";

export class Controller {
  static async template(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    const session = await startSession();
    try {
      const imgBase64: string[] = [];
      for (const keys of (req.files as Express.Multer.File[])) {
        imgBase64.push(keys.buffer.toString('base64'));
      }
      // const imgBase64 = buffer.toString('base64');
      // ! await firebase => butuh response url imagenya
      const newJob = new Job({
        images: ['testing.link', 'testing.link'],
        description: 'testing bikin job',
        address: 'jalan jalan ke taman ria',
        fee: 50000,
        categoryId: 'test',
        workerId: 'test',
        clientId: req.user?._id
      });
      await session.withTransaction(async () => {
        await newJob.save({session});
        const newJobStatus = new JobStatus({
          jobId: newJob._id
        });
        await newJobStatus.save({session});
        res.status(201).json({message: 'Job is successfully created!'});
      });
    } catch (err) {
      next(err);
    } finally {
      session.endSession();
    }
  }
}