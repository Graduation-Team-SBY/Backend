import { model, Schema } from "mongoose";
import { IWorkerProfileSchema } from "../types";

const workerProfileSchema = new Schema<IWorkerProfileSchema>({
  userId: { type: String, required: true },
  bio: { type: String, required: true },
  joinDate: { type: Date, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

export const WorkerProfile = model('WorkerProfile', workerProfileSchema);