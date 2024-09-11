import { io as ioClient, type Socket as ClientSocket } from "socket.io-client";
import { io as ioServer } from "../app";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { User } from "../models/user";
import { Profile } from "../models/profile";
import { WorkerProfile } from "../models/workerprofile";
import { Category } from "../models/category";
import { Job } from "../models/job";
import { Chat } from "../models/chat";
import { socketFunc } from "../services/socket";
import { Wallet } from "../models/wallet";
import { hashPassword } from "../helpers/bcrypt";

const MONGO_URI = process.env.MONGO_URI as string;
const PORT = process.env.PORT || 3000;

let clientUserSocket: ClientSocket;
let workerUserSocket: ClientSocket;
let newYasa: any;
let newJalu: any;
let newYasaProfile: any;
let newJaluProfile: any;
let newBebersih: any;
let newNitip: any;
let newJobBebersih: any;
let newJobBebersih2: any;
let newJobNitip: any;
let existingChat: any;
let newChatJobBebersih2: any;
let jobWithExistingChat: any;

async function setupDatabase() {
  await mongoose.disconnect();
  await mongoose.connect(MONGO_URI, { dbName: "testing3" });

  await User.deleteMany({});
  await Profile.deleteMany({});
  await WorkerProfile.deleteMany({});
  await Category.deleteMany({});
  await Job.deleteMany({});
  await Chat.deleteMany({});

  newYasa = new User({
    email: "yasa@mail.com",
    phoneNumber: "081987654321",
    password: "user123",
    role: "worker",
  });

  newJalu = new User({
    email: "jalu@mail.com",
    phoneNumber: "081234567890",
    password: "user123",
    role: "client",
  });

  newYasa.password = hashPassword(newYasa.password);
  newJalu.password = hashPassword(newJalu.password);
  await Promise.all([newYasa.save(), newJalu.save()]);

  newYasaProfile = new WorkerProfile({
    bio: "Experienced cleaner",
    dateOfBirth: new Date("1990-02-02"),
    profilePicture: "https://picsum.photos/201",
    address: "456 Elm St",
    job: 5,
    rating: 4,
    userId: newYasa._id,
  });

  newJaluProfile = new Profile({
    name: "Yasa",
    dateOfBirth: new Date("1990-02-02"),
    profilePicture: "https://picsum.photos/200",
    address: "456 Elm St",
    userId: newJalu._id,
  });

  newBebersih = new Category({
    name: "Bebersih",
    description: "Category Bebersih",
  });

  newNitip = new Category({
    name: "Nitip",
    description: "Category Nitip",
  });
  newChatJobBebersih2 = new Chat({});

  await Promise.all([newBebersih.save(), newNitip.save(), newJaluProfile.save(), newYasaProfile.save(), newChatJobBebersih2.save(), Wallet.updateOne({ userId: new ObjectId(newJalu._id) }, { amount: 500000 })]);

  newJobBebersih = new Job({
    title: "Bersihin rumahku",
    description: "Tolong bersihin rumahku",
    address: "789 Oak St",
    fee: 1000,
    images: ["https://picsum.photos/203", "https://picsum.photos/205"],
    coordinates: { lat: -7.2654509, lng: 112.7468853 },
    addressNotes: "depan gang",
    clientId: new ObjectId(newJalu._id),
    workerId: new ObjectId(newYasa._id),
    categoryId: new ObjectId(newBebersih._id),
  });
  newJobBebersih2 = new Job({
    title: "Bersihin rumahku",
    description: "Tolong bersihin rumahku",
    address: "789 Oak St",
    fee: 1000,
    images: ["https://picsum.photos/203", "https://picsum.photos/205"],
    coordinates: { lat: -7.2654509, lng: 112.7468853 },
    addressNotes: "depan gang",
    clientId: new ObjectId(newJalu._id),
    workerId: new ObjectId(newYasa._id),
    categoryId: new ObjectId(newBebersih._id),
    chatId: newChatJobBebersih2._id,
  });
  newJobNitip = new Job({
    title: "Nitip beli barang",
    description: "Tolong belikan barang",
    address: "789 Oak St",
    fee: 1000,
    images: ["https://picsum.photos/203", "https://picsum.photos/205"],
    coordinates: { lat: -7.2654509, lng: 112.7468853 },
    addressNotes: "depan gang",
    clientId: new ObjectId(newJalu._id),
    workerId: new ObjectId(newYasa._id),
    categoryId: new ObjectId(newNitip._id),
  });

  await Promise.all([newJobBebersih.save(), newJobBebersih2.save(), newJobNitip.save()]);

  existingChat = new Chat({});
  await existingChat.save();
  jobWithExistingChat = new Job({
    title: "Job with Existing Chat",
    description: "This job already has a chat",
    address: "123 Existing St",
    fee: 1000,
    coordinates: { lat: -7.2654509, lng: 112.7468853 },
    addressNotes: "depan gang",
    clientId: new ObjectId(newJalu._id),
    workerId: new ObjectId(newYasa._id),
    categoryId: new ObjectId(newBebersih._id),
    chatId: existingChat._id,
  });

  await jobWithExistingChat.save();
}
beforeAll(async () => {
  try {
    await setupDatabase();
    socketFunc(ioServer);

    clientUserSocket = ioClient(`http://localhost:${PORT}`);
    workerUserSocket = ioClient(`http://localhost:${PORT}`);

    await Promise.all([
      new Promise<void>((resolve) => {
        clientUserSocket.on("connect", () => resolve());
      }),
      new Promise<void>((resolve) => {
        workerUserSocket.on("connect", () => resolve());
      }),
    ]);
  } catch (err) {
    console.error(`MONGO CONNECTION ERROR ${err}`);
  }
});

afterAll(async () => {
  await Promise.all([
    new Promise<void>((resolve) => {
      if (clientUserSocket.connected) {
        clientUserSocket.on("disconnect", () => resolve());
        clientUserSocket.close();
      } else {
        resolve();
      }
    }),
    new Promise<void>((resolve) => {
      if (workerUserSocket.connected) {
        workerUserSocket.on("disconnect", () => resolve());
        workerUserSocket.close();
      } else {
        resolve();
      }
    }),
  ]);
  await mongoose.disconnect();
});
describe("Additional Chat Socket.IO Tests", () => {
  test("should handle joining a room with existing chat", async () => {
    const existingChat = await Chat.create({});
    const jobWithExistingChat = await Job.create({
      title: "Job with Existing Chat",
      description: "This job already has a chat",
      address: "123 Existing St",
      fee: 1000,
      clientId: new ObjectId(newJalu._id),
      workerId: new ObjectId(newYasa._id),
      categoryId: new ObjectId(newBebersih._id),
      chatId: existingChat._id,
    });

    return new Promise<void>((resolve) => {
      const handler = (data: any) => {
        expect(data.currJob._id.toString()).toBe(jobWithExistingChat._id.toString());
        expect(data.chats._id.toString()).toBe(existingChat._id.toString());
        expect(data.clientProfile._id.toString()).toBe(newJaluProfile._id.toString());
        expect(data.workerProfile._id.toString()).toBe(newYasaProfile._id.toString());
        clientUserSocket.off("joined_room", handler);
        resolve();
      };
      clientUserSocket.on("joined_room", handler);
      clientUserSocket.emit("join_room", jobWithExistingChat._id.toString());
    });
  });

  test("should handle error when joining a non-existent room", (done) => {
    const nonExistentJobId = new ObjectId().toString();

    const handler = (error: any) => {
      expect(error).toBe("JobNotFound");
      clientUserSocket.off("error_handler", handler);
      done();
    };
    clientUserSocket.on("error_handler", handler);
    clientUserSocket.emit("join_room", nonExistentJobId);
  });

  test.only("should send message and update chat in database", async () => {
    const messageData = {
      room: newJobBebersih2._id.toString(),
      senderId: newJobBebersih2.clientId.toString(),
      message: "hello",
      createdAt: new Date(),
    };

    console.log(messageData, " << message Data");

    // Ensure the job has a chatId before proceeding
    const jobWithChat = await Job.findById(newJobBebersih2._id);
    if (!jobWithChat) {
      throw new Error("Job not found during test initialization");
    }

    console.log(jobWithChat.chatId, "<< jobWithChat.chatId");

    // Ensure initial connection and joining of room
    await new Promise<void>((resolve) => {
      const handler = () => {
        clientUserSocket.off("joined_room", handler);
        resolve();
      };
      clientUserSocket.on("joined_room", handler);
      clientUserSocket.emit("join_room", newJobBebersih2._id.toString());
    });

    // Log chat state before sending the message
    const preChatState = await Chat.findById(jobWithChat.chatId);
    console.log(preChatState, "<< Pre Chat State");

    return new Promise<void>((resolve) => {
      const receiveMessageHandler = async (data: any) => {
        console.log(data, "<<< Received data");

        // Allow some time for changes to propagate
        setTimeout(async () => {
          const updatedChat = await Chat.findById(jobWithChat.chatId);
          console.log(updatedChat, "<< Updated chat");

          expect(updatedChat).toBeDefined();
          if (updatedChat) {
            expect(updatedChat.contents).toContainEqual(
              expect.objectContaining({
                message: messageData.message,
                senderId: messageData.senderId,
              })
            );
          }

          // Off the listener for cleaner code
          workerUserSocket.off("receive_message", receiveMessageHandler);
          resolve();
        }, 500); // Give some time for database operations
      };

      workerUserSocket.on("receive_message", receiveMessageHandler);
      clientUserSocket.emit("send_message", messageData, jobWithChat.chatId, newJalu._id);
    });
  });
  
  test("should handle sending message to non-existent chat", (done) => {
    const messageData = {
      content: "This message should not be sent",
      room: newJobBebersih._id.toString(),
    };
    const nonExistentChatId = new ObjectId().toString();

    const handler = (error: any) => {
      expect(error).toBe("ChatNotFound");
      clientUserSocket.off("error_handler", handler);
      done();
    };
    clientUserSocket.on("error_handler", handler);
    clientUserSocket.emit("send_message", messageData, nonExistentChatId, newJalu._id.toString());
  });
});
describe("Chat Socket.IO Tests", () => {
  test("should join room successfully", () => {
    clientUserSocket.emit("join_room", newJobBebersih._id.toString());

    clientUserSocket.on("joined_room", (data) => {
      expect(data).toBeDefined();
      expect(data.currJob._id.toString()).toBe(newJobBebersih._id.toString());
      expect(data.clientProfile._id.toString()).toBe(newJaluProfile._id.toString());
      expect(data.workerProfile._id.toString()).toBe(newYasaProfile._id.toString());
      expect(data.chats).toBeDefined();
    });
  });

  test("should handle joining non-existent room", () => {
    const fakeJobId = new ObjectId().toString();
    clientUserSocket.emit("join_room", fakeJobId);

    clientUserSocket.on("error_handler", (error) => {
      expect(error).toBe("JobNotFound");
    });
  });

  test("should send and receive message", () => {
    const messageData = {
      content: "Hello, this is a test message",
      room: newJobBebersih._id.toString(),
    };

    clientUserSocket.emit("join_room", newJobBebersih._id.toString());

    clientUserSocket.on("joined_room", () => {
      clientUserSocket.emit("send_message", messageData, newJobBebersih.chatId.toString(), newJalu._id.toString());
    });

    workerUserSocket.on("receive_message", (data) => {
      expect(data.content).toBe(messageData.content);
      expect(data.room).toBe(messageData.room);
      expect(data.senderId).toBe(newJalu._id.toString());
    });
  });

  test("should handle sending message to non-existent chat", () => {
    const fakeMessageData = {
      content: "This should fail",
      room: newJobBebersih._id.toString(),
    };
    const fakeChatId = new ObjectId().toString();

    clientUserSocket.emit("send_message", fakeMessageData, fakeChatId, newJalu._id.toString());

    clientUserSocket.on("error_handler", (error) => {
      expect(error).toBe("ChatNotFound");
    });
  });

  test("should create a new chat if it doesn't exist", async () => {
    const jobWithoutChat = new Job({
      title: "New Job Without Chat",
      description: "This job doesn't have a chat yet",
      address: "123 Test St",
      fee: 1000,
      clientId: new ObjectId(newJalu._id),
      workerId: new ObjectId(newYasa._id),
      categoryId: new ObjectId(newBebersih._id),
    });
    await jobWithoutChat.save();

    clientUserSocket.emit("join_room", jobWithoutChat._id.toString());

    clientUserSocket.on("joined_room", async (data) => {
      expect(data.currJob._id.toString()).toBe(jobWithoutChat._id.toString());
      expect(data.chats).toBeDefined();

      const updatedJob = await Job.findById(jobWithoutChat._id);
      expect(updatedJob?.chatId).toBeDefined();

      const chat = await Chat.findById(updatedJob?.chatId);
      expect(chat).toBeDefined();
    });
  });
});
