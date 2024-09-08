import { model, Schema } from 'mongoose';
import { IWalletSchema } from '../types';

const walletSchema = new Schema<IWalletSchema>({
  amount: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const Wallet = model('Wallet', walletSchema);
