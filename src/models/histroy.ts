import { model, Schema } from "mongoose";
import { IHistorySchema } from "../types";

const historySchema = new Schema<IHistorySchema>({
  transactionId: { type: String, required: true },
});

export const History = model('History', historySchema);