import { model, Schema } from "mongoose";
import { IUserSchema } from "../types";

const userSchema = new Schema<IUserSchema>({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters!'] },
    isWorker: { type: Boolean, default: false }
});

userSchema.set('validateBeforeSave', true);

export const User = model('User', userSchema);