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

describe(`POST /payment/topup`, () => {
  describe(`Success`, () => {
    test(`Success Creating Topup Transaction 200`, async () => {
      const response = await request(app)
        .post(`/payment/topup`)
        .send({
          amount: 100000,
        })
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`topupId`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).post(`/payment/topup`).field({
        amount: `100000`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app)
        .post(`/payment/topup`)
        .field({
          amount: 100000,
        })
        .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`PATCH /profile/wallet`, () => {
  describe(`Success`, () => {
    test(`Success Topup wallet balance 200`, async () => {
      const response = await request(app)
        .patch(`/profile/wallet`)
        .send({
          topupId: `172599500616766dfc117ebbee2647f672ac3`,
        })
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `TopUp Success`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, Topup Transaction Not Found`, async () => {
      const response = await request(app)
        .patch(`/profile/wallet`)
        .send({
          topupId: `172599443454566dfc117ebbee2647f672ac4`,
        })
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).patch(`/profile/wallet`).send({
        topupId: `172599506627366dfc117ebbee2647f672ac3`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app)
        .patch(`/profile/wallet`)
        .send({
          topupId: `172599506627366dfc117ebbee2647f672ac3`,
        })
        .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});
