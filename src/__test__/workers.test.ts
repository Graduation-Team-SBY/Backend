import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";

const MONGO_URI: any = process.env.MONGO_URI;
let tokenClient: string;
let tokenWorker: string;
let tokenClientError: string;
let tokenWorkerError: string;

beforeAll(async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "testing2" });

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

describe(`GET /clients/best-yasa`, () => {
  describe(`Success`, () => {
    test(`Success Get The Best Yasa list 200`, async () => {
      const response = await request(app).get(`/clients/best-yasa`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/clients/best-yasa`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/clients/best-yasa`).set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});
