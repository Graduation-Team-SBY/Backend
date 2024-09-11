import { Chat } from "../models/chat";
import { Job } from "../models/job";
import { Profile } from "../models/profile";
import { WorkerProfile } from "../models/workerprofile";

export const socketFunc = (io: any) => {
  io.on("connection", (socket: any) => {
    // console.log(`User connected => ${socket.id}`);
    socket.on("join_room", async (jobId: string) => {
      let chatId: any;
      try {
        const currJob = await Job.findById(jobId);
        if (!currJob) {
          throw "JobNotFound";
        }
        chatId = currJob.chatId || (await Chat.create({}))._id;
        if (!currJob.chatId) {
          currJob.chatId = chatId;
          await currJob.save();
        }

        socket.join(jobId);

        const [clientProfile, workerProfile, chats] = await Promise.all([Profile.findOne({ userId: currJob.clientId }), WorkerProfile.findOne({ userId: currJob.workerId }), Chat.findById(chatId)]);
        socket.emit("joined_room", { currJob, clientProfile, workerProfile, chats });
      } catch (err) {
        console.log("Error in join_room", err);
        socket.emit("error_handler", err || "ServerError");
      }
    });

    socket.on("send_message", async (data: any, chatId: string, senderId: string) => {
      try {
        let chat = await Chat.findById(chatId);
        if (!chat) {
          throw "ChatNotFound";
        }
        data.senderId = senderId;
        chat.contents.push(data);
        await chat.save();
        io.to(data.room).emit("receive_message", data);
      } catch (err) {
        console.log("Error in message", err);
        socket.emit("error_handler", err || "ServerError");
      }
    });

    socket.on("disconnect", () => {
      // console.log("User Disconnected", socket.id);
    });
  });
};
