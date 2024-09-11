import { model, Schema } from "mongoose";
import { IJobSchema } from "../types";

const jobSchema = new Schema<IJobSchema>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: { type: Object, default: null },
  addressNotes: { type: String, default: null },
  fee: { type: Number, required: true },
  images: { type: Array, default: null },
  clientId: { type: Schema.Types.ObjectId, required: true },
  workerId: { type: Schema.Types.ObjectId, default: null },
  categoryId: { type: Schema.Types.ObjectId, required: true },
  chatId: { type: Schema.Types.ObjectId, default: null },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const Job = model("Job", jobSchema);
