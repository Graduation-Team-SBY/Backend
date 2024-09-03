import { Schema } from "mongoose";
import { IJobStatusSchema } from "../types";

const jobStatusSchema = new Schema<IJobStatusSchema>({
    isWorkerConfirmed: { type: Boolean, default: false },
    isClientConfirmed: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false }
});