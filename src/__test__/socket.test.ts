import mongoose from "mongoose";
import { io } from "../app";
import { Server } from "socket.io";
import { io as ioc } from "socket.io-client";
import { signToken } from "../helpers/jwt";
import { hashPassword } from "../helpers/bcrypt";
import { ObjectId } from "mongodb";
import { User } from "../models/user";
import { Wallet } from "../models/wallet";
import { Profile } from "../models/profile";
import { WorkerProfile } from "../models/workerprofile";
import { Job } from "../models/job";
import { socketFunc } from "../services/socket";

const MONGO_URI : any = process.env.MONGO_URI;
let tokenClient : string;
let tokenWorker : string;
let tokenClientEmpty : string;
let tokenWorkerEmpty : string;
let tokenClientPickJob : string;
let tokenWorkerReviews : string;
let clientSocket : any;
let serverSocket : any;

const userSeed = [
    {
        _id: new ObjectId(),
        email: `client1@email.com`,
        phoneNumber: `08987654321`,
        password: hashPassword(`cheetah123`),
        role: `client`
    },
    {
        _id: new ObjectId(),
        email: `client2@email.com`,
        phoneNumber: `08977664321`,
        password: hashPassword(`cheetah123`),
        role: `client`
    },
    {
        _id: new ObjectId(),
        email: `worker1@email.com`,
        phoneNumber: `08987554521`,
        password: hashPassword(`cheetah123`),
        role: `worker`
    },
    {
        _id: new ObjectId(),
        email: `worker2@email.com`,
        phoneNumber: `08977664441`,
        password: hashPassword(`cheetah123`),
        role: `worker`
    }
]

const walletSeed = [
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[0]._id
    },
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[2]._id
    },
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[1]._id
    },
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[3]._id
    }
]

const clientProfileSeed = [
    {
        _id: new ObjectId(),
        name: `Client 1 Test`,
        dateOfBirth: new Date(`2000-11-16`),
        profilePicture: `https://picsum.photos/200`,
        address: `Paris van java, Bandung`,
        userId: userSeed[0]._id
    },
    {
        _id: new ObjectId(),
        name: null,
        dateOfBirth: null,
        profilePicture: null,
        address: null,
        userId: userSeed[1]._id
    }
]

const workerProfileSeed = [
    {
        _id: new ObjectId(),
        name: `Worker 1 Test`,
        dateOfBirth: new Date(`2000-11-16`),
        profilePicture: `https://picsum.photos/200`,
        address: `Paris van java, Bandung`,
        jobDone: 2,
        rating: 4,
        userId: userSeed[2]._id
    },
    {
        _id: new ObjectId(),
        name: null,
        dateOfBirth: null,
        profilePicture: null,
        address: null,
        jobDone: 0,
        rating: 0,
        userId: userSeed[3]._id
    }
]

const jobSeed = [
    {
        _id: new ObjectId(),
        title: `Belikan Buah Segar`,
        description: `Belikan Buah Anggur Hijau di Indomaret`,
        address: `Keputih, Surabaya`,
        adressNotes: `Depan Kost`,
        fee: 2000,
        images: null,
        clientId: userSeed[0]._id,
        workerId: userSeed[2]._id,
        chatId: new ObjectId(),
        categoryId: new ObjectId(`66e11fc199da71c3d8a31e9c`)
    },
    {
        _id: new ObjectId(),
        title: `Belikan Baterai`,
        description: `Belikan Baterai AAA di Indomaret`,
        address: `Keputih, Surabaya`,
        adressNotes: `Depan Kost`,
        fee: 2000,
        images: null,
        clientId: userSeed[0]._id,
        workerId: userSeed[2]._id,
        chatId: new ObjectId(),
        categoryId: new ObjectId(`66e11fc199da71c3d8a31e9c`)
    },
    {
        _id: new ObjectId(),
        title: `Belikan Hotwheels`,
        description: `Belikan Hotwheels di Indomaret`,
        address: `Keputih, Surabaya`,
        adressNotes: `Depan Kost`,
        fee: 2000,
        images: null,
        clientId: userSeed[0]._id,
        workerId: null,
        categoryId: new ObjectId(`66e11fc199da71c3d8a31e9c`)
    },
    {
        _id: new ObjectId(),
        title: `Belikan Bakso`,
        description: `Belikan Bakso di Indomaret`,
        address: `Keputih, Surabaya`,
        adressNotes: `Depan Kost`,
        fee: 2000,
        images: null,
        clientId: userSeed[0]._id,
        workerId: null,
        categoryId: new ObjectId(`66e11fc199da71c3d8a31e9c`)
    },
    {
        _id: new ObjectId(),
        title: `Ngapain Sih`,
        description: `Hapus Aja Ini`,
        address: `Keputih, Surabaya`,
        adressNotes: `Depan Kost`,
        fee: 2000,
        images: null,
        clientId: userSeed[0]._id,
        workerId: null,
        categoryId: new ObjectId(`66e11fc199da71c3d8a31e9c`)
    }
]

beforeAll(async () => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "testing"});

        await User.insertMany(userSeed);
        await Wallet.insertMany(walletSeed);
        await Profile.insertMany(clientProfileSeed);
        await WorkerProfile.insertMany(workerProfileSeed);
        await Job.insertMany(jobSeed);

        tokenClient = signToken({ _id: String(userSeed[0]._id) });
        tokenWorker = signToken({ _id: String(userSeed[2]._id) });
        tokenClientEmpty = signToken({ _id: String(userSeed[1]._id) });
        tokenWorkerEmpty = signToken({ _id: String(userSeed[3]._id) });
        tokenClientPickJob = signToken({ _id: `66dc034d2efcced67245fdad`});
        tokenWorkerReviews = signToken({ _id: `66dc09e06f4066bc1defb4bf` });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await Job.deleteMany();
        await WorkerProfile.deleteMany();
        await Profile.deleteMany();
        await Wallet.deleteMany();
        await User.deleteMany();

        await mongoose.connection.close();
    } catch (error) {
        console.log(error);
    }
});

describe(`Yasa-Jalu Chat`, () => {
    beforeAll((done : any) => {
        socketFunc(io);
        io.on("connection", (socket : any) => {
            serverSocket = socket
        });
        clientSocket = ioc(`http://localhost:3000`);
        clientSocket.on("connect", done)
    })

    afterAll(() => {
        io.close();
        clientSocket.disconnect();
    })

    test(`Joining Room`, (done : any) => {
        clientSocket.on("hello", (arg : any) => {
            expect(arg).toBe("world");
            done();
          });
        serverSocket.emit("hello", "world");
        // clientSocket.emit("send_message", String(jobSeed[0].chatId));
        // done();
    })
})