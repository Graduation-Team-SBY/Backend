import { model, Schema } from "mongoose";
import { IWalletSchema } from "../types";

const walletSchema = new Schema<IWalletSchema>({
    amount: { type: Number, required: true },
    userId: { type: String, required: true }
});

export const Wallet = model('Wallet', walletSchema);