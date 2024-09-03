import { model, Schema } from "mongoose";
import { IUserSchema } from "../types";

const userSchema = new Schema<IUserSchema>({
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    isWorker: { type: Boolean, default: false }
});

export const User = model('User', userSchema);