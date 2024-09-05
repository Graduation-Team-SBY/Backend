import { model, Schema } from "mongoose";
import { IProfileSchema } from "../types";
import { ObjectId } from "mongodb";
<<<<<<< HEAD
const profileSchema = new Schema<IProfileSchema>({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  profilePicture: { type: String },
  address: { type: String, required: true },
  userId: { type: ObjectId, required: true },
=======

const profileSchema = new Schema<IProfileSchema>({
    name: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    profilePicture: { type: String },
    address: { type: String, default: null },
    userId: ObjectId
>>>>>>> 7cf625a7069e815dbcea3de5cf1eb1bd9c29b1db
});

export const Profile = model("Profile", profileSchema);
