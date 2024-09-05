import { model, Schema } from "mongoose";
import { ITransactionSchema } from "../types";

const transactionSchema = new Schema<ITransactionSchema>({
  clientId: { type: String, required: true },
  workerId: { type: String, required: true },
  jobId: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

export const Transaction = model('Transaction', transactionSchema);