import { model, Schema } from "mongoose";
import { IReviewSchema } from "../types";
import { ObjectId } from "mongodb";
const reviewSchema = new Schema<IReviewSchema>({
  transactionId: { type: ObjectId, required: true },
  description: { type: String },
  rating: { type: Number, required: true },
  images: { type: [String], required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

export const Review = model("Review", reviewSchema);
