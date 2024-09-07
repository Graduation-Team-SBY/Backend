import { model, Schema } from "mongoose";
import { IChatSchema } from "../types";

const categorySchema = new Schema<IChatSchema>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const Category = model("Category", categorySchema);
