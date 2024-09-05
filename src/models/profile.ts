import { model, Schema } from "mongoose";
import { IProfileSchema } from "../types";
import { ObjectId } from "mongodb";

const profileSchema = new Schema<IProfileSchema>({
    name: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    profilePicture: { type: String },
    address: { type: String, default: null },
    userId: ObjectId,
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
});

export const Profile = model("Profile", profileSchema);
