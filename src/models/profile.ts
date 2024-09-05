import { model, Schema } from "mongoose";
import { IProfileSchema } from "../types";
import { ObjectId } from "mongodb";
const profileSchema = new Schema<IProfileSchema>({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  profilePicture: { type: String },
  address: { type: String, required: true },
  userId: { type: ObjectId, required: true },
});

export const Profile = model("Profile", profileSchema);
