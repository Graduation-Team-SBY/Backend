import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";
import { hashPassword } from "../helpers/bcrypt";
import { User } from "../models/user";
import { ObjectId } from "mongodb";
import { Wallet } from "../models/wallet";
import { TopUp } from "../models/topup";

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

const walletSeed = [
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[0]._id
    },
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[1]._id
    },
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[2]._id
    },
    {
        _id: new ObjectId(),
        amount: 200000,
        userId: userSeed[3]._id
    }
]

const tempTopupId : any = []

beforeAll(async () => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "testing"});

        await User.insertMany(userSeed);
        await Wallet.insertMany(walletSeed);

        tokenClient = signToken({ _id: String(userSeed[0]._id) });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await TopUp.deleteMany();
        await Wallet.deleteMany();
        await User.deleteMany();

        await mongoose.connection.close();
    } catch (error) {
        console.log(error);
    }
});

describe(`POST /payment/topup`, () => {
    describe(`Success`, () => {
        test(`Success Creating Topup Transaction 200`, async () => {
            const response = await request(app)
                .post(`/payment/topup`)
                .send({
                    amount: 100000
                })
                .set(`Authorization`, `Bearer ${tokenClient}`);

            tempTopupId.push(response.body);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`topupId`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .post(`/payment/topup`)
                .field({
                    amount: 100000
                })

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .post(`/payment/topup`)
                .field({
                    amount: 100000
                })
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`PATCH /profile/wallet`, () => {
    describe(`Success`, () => {
        test(`Success Topup wallet balance 200`, async () => {
            const response = await request(app)
                .patch(`/profile/wallet`)
                .send({
                    topupId: tempTopupId[0].topupId
                })
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `TopUp Success`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, Topup Transaction Not Found`, async () => {
            const response = await request(app)
                .patch(`/profile/wallet`)
                .send({
                    topupId: `172599443454566dfc117ebbee2647f672ac4`
                })
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .patch(`/profile/wallet`)
                .send({
                    topupId: `172599506627366dfc117ebbee2647f672ac3`
                })

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .patch(`/profile/wallet`)
                .send({
                    topupId: `172599506627366dfc117ebbee2647f672ac3`
                })
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})