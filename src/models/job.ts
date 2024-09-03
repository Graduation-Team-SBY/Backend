import { model, Schema } from "mongoose";
import { IJobSchema } from "../types";

const jobSchema = new Schema<IJobSchema>({
    description: { type: String, required: true },
    address: { type: String, required: true },
    fee: { type: Number, required: true },
    clientId: { type: String, required: true },
    workerId: { type: String, required: true },
    categoryId: { type: String, required: true },
    jobStatusId: { type: String, required: true }
});

export const Job = model('Job', jobSchema);