import { model, Schema } from "mongoose";
import { IChatSchema, IChatContent } from "../types";

const chatSchema = new Schema<IChatSchema>({
  contents: {
    type: [
      {
        senderId: Schema.Types.ObjectId,
        message: Schema.Types.String,
        createdAt: Schema.Types.Date,
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const Chat = model("Chat", chatSchema);
