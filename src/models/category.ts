import { model, Schema } from "mongoose";
import { ICategorySchema } from "../types";

const categorySchema = new Schema<ICategorySchema>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const Category = model('Category', categorySchema);