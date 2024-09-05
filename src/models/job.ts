import { model, Schema } from "mongoose";
import { IJobSchema } from "../types";
import { ObjectId } from "mongodb";

const jobSchema = new Schema<IJobSchema>({
    description: { type: String, required: true },
    address: { type: String, required: true },
    fee: { type: Number, required: true },
    images: { type: Array, default: null },
    clientId: { type: ObjectId, required: true },
    workerId: { type: ObjectId, default: null },
    categoryId: { type: ObjectId, required: true }
});

export const Job = model('Job', jobSchema);