import { model, Schema } from "mongoose";
import { IJobRequestSchema } from "../types";

const jobRequestSchema = new Schema<IJobRequestSchema>({
  jobId: { type: Schema.Types.ObjectId, required: true },
  workerId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

export const JobRequest = model("JobRequest", jobRequestSchema);
