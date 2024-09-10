import { model, Schema } from "mongoose";
import { IReviewSchema } from "../types";

const reviewSchema = new Schema<IReviewSchema>({
  jobId: { type: Schema.Types.ObjectId, required: true },
  description: { type: String },
  rating: { type: Number, required: true },
  images: { type: [String] },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const Review = model("Review", reviewSchema);
