import { model, Schema } from "mongoose";
import { IJobRequestSchema } from "../types";
import { ObjectId } from "mongodb";
const jobRequestSchema = new Schema<IJobRequestSchema>({
  jobId: { type: ObjectId, required: true },
  workerId: { type: ObjectId, required: true },
});

export const JobRequest = model("JobRequest", jobRequestSchema);
