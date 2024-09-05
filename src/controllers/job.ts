import { NextFunction, Request, Response } from "express";
import { Job } from "../models/job";
import { ObjectId } from "mongodb";
import { uploadImageFiles } from "../services/firebase";
import { startSession } from "mongoose";

export class Controller {
  static async createJobBersih(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
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
      session.endSession();
    }
  }

  static async createJobBelanja(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
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

  static async activeJobsClient(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.query;
      const query: { clientId: ObjectId, categoryId?: ObjectId } = {
        clientId: req.user?._id as ObjectId
      }
      if (categoryId) {
        query.categoryId = new ObjectId(categoryId as string)
      }
      const jobs = await Job.find(query);
      res.status(200).json(jobs);
    } catch (err) {
      next(err);
    }
  }

  static async allJobsWorker(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.query;
      const query: { categoryId?: ObjectId } = {}
      if (categoryId) {
        query.categoryId = new ObjectId(categoryId as string)
      }
      const jobs = await Job.find(query);
      res.status(200).json(jobs);
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
