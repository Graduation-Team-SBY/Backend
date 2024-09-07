import { model, Schema } from "mongoose";
import { ICategorySchema } from "../types";

const categorySchema = new Schema<ICategorySchema>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

export const Category = model('Category', categorySchema);