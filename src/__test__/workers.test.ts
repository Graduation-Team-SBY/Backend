import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";

const MONGO_URI : any = process.env.MONGO_URI;
let tokenClient : string;
let tokenWorker : string;
let tokenClientError : string;
let tokenWorkerError : string;

beforeAll(async () => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "testing"});

        tokenClient = signToken({ _id: `66dfc117ebbee2647f672ac3` });
        tokenWorker = signToken({ _id: `66dfc17bebbee2647f672acf` });
        tokenClientError = signToken({ _id: `66dfd17ce534116f78e27b14` });
        tokenWorkerError = signToken({ _id: `66dfe5bee534116f78e27b3f` });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.log(error);
    }
});