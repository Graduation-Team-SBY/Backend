import { model, Schema } from "mongoose";
import { IReviewSchema } from "../types";

const reviewSchema = new Schema<IReviewSchema>({
    transactionId: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, required: true },
    images: { type: [String], required: true },
});

export const Review = model('Review', reviewSchema);