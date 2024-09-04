import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";
import { IJobStatusSchema } from "../types";

const jobStatusSchema = new Schema<IJobStatusSchema>({
    jobId: { type: ObjectId, required: true },
    isWorkerConfirmed: { type: Boolean, default: false },
    isClientConfirmed: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false }
});

export const JobStatus = model('JobStatus', jobStatusSchema);