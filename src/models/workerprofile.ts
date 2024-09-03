import { model, Schema } from "mongoose";
import { IWorkerProfileSchema } from "../types";

const workerProfileSchema = new Schema<IWorkerProfileSchema>({
  userId: { type: String, required: true },
  bio: { type: String, required: true },
  joinDate: { type: Date, required: true },
  rating: { type: Number, required: true },
});

export const WorkerProfile = model('WorkerProfile', workerProfileSchema);