import { model, Schema } from "mongoose";
import { ITransactionSchema } from "../types";
import { ObjectId } from "mongodb";

const transactionSchema = new Schema<ITransactionSchema>({
  clientId: { type: Schema.Types.ObjectId, required: true },
  workerId: { type: Schema.Types.ObjectId, required: true },
  jobId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Schema.Types.Date, default: new Date() },
  updatedAt: { type: Schema.Types.Date, default: new Date() }
});

export const Transaction = model('Transaction', transactionSchema);