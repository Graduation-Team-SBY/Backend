import { model, Schema } from 'mongoose';
import { IUserSchema } from '../types';

const userSchema = new Schema<IUserSchema>({
  email: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Invalid email address'] },
  phoneNumber: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters!'],
  },
  role: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

userSchema.set('validateBeforeSave', true);

export const User = model('User', userSchema);
