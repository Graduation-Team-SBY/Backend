import { model, Schema } from "mongoose";
import { IProfileSchema } from "../types";

const profileSchema = new Schema<IProfileSchema>({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    profilePicture: { type: String },
    address: { type: String, required: true },
    userId: String
});

export const Profile = model('Profile', profileSchema);