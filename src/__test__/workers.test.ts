import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";
import { hashPassword } from "../helpers/bcrypt";
import { User } from "../models/user";
import { WorkerProfile } from "../models/workerprofile";
import { ObjectId } from "mongodb";

const MONGO_URI : any = process.env.MONGO_URI;
let tokenClient : string;

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

beforeAll(async () => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "testing"});

        await User.insertMany(userSeed);
        await WorkerProfile.insertMany(workerProfileSeed);

        tokenClient = signToken({ _id: String(userSeed[0]._id) });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await WorkerProfile.deleteMany();
        await User.deleteMany();

        await mongoose.connection.close();
    } catch (error) {
        console.log(error);
    }
});

describe(`GET /clients/best-yasa`, () => {
    describe(`Success`, () => {
        test(`Success Get The Best Yasa list 200`, async () => {
            const response = await request(app)
                .get(`/clients/best-yasa`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/clients/best-yasa`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/clients/best-yasa`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})