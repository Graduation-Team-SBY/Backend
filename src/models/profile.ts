import { model, Schema } from "mongoose";
import { IProfileSchema } from "../types";
import { ObjectId } from "mongodb";

const profileSchema = new Schema<IProfileSchema>({
    name: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    profilePicture: { type: String },
    address: { type: String, default: null },
    userId: ObjectId
});

export const Profile = model('Profile', profileSchema);