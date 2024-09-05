import { Job } from "../models/job";
import { AuthRequest } from "../types";
import { Response, NextFunction } from "express";
import { ObjectId } from "mongodb";

export const authorization = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(new ObjectId(jobId));
    if (!job) {
      throw {name: 'NotFound'};
    }
    if (`${job.clientId}` !== `${req.user?._id}`) {
      throw {name: 'Forbidden'};
    }
    next();
  } catch (err) {
    next(err);
  }
}