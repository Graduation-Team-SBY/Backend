import { model, Schema } from "mongoose";
import { IJobRequestSchema } from "../types";

const jobRequestSchema = new Schema<IJobRequestSchema>({
    jobId: { type: String, required: true },
    workerId: { type: String, required: true }
});

export const JobRequest = model('JobRequest', jobRequestSchema);