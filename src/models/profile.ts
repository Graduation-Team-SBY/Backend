import { model, Schema } from "mongoose";
import { IProfileSchema } from "../types";


const profileSchema = new Schema<IProfileSchema>({
    name: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    profilePicture: { type: String, default: null },
    address: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
});

export const Profile = model("Profile", profileSchema);
