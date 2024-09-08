import { model, Schema } from "mongoose";
import { ITopUpSchema } from "../types";

const topUpSchema = new Schema<ITopUpSchema>({
  topupId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  transToken: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Schema.Types.Date, default: new Date() },
  updatedAt: { type: Schema.Types.Date, default: new Date() }
});

export const TopUp = model('TopUp', topUpSchema);