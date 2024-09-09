import { model, Schema } from "mongoose";
import { IWorkerProfileSchema } from "../types";

const workerProfileSchema = new Schema<IWorkerProfileSchema>({
  userId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, default: null },
  bio: { type: String, default: null },
  address: { type: String, default: null },
  coordinates: { type: String, default: null },
  addressNotes: { type: String, default: null },
  dateOfBirth: { type: Date, default: null },
  profilePicture: { type: String, default: null },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const WorkerProfile = model("WorkerProfile", workerProfileSchema);
