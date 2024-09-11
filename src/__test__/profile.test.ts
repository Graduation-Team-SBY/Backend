import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";

const MONGO_URI: any = process.env.MONGO_URI;
let tokenClient: string;
let tokenWorker: string;
let tokenClientError: string;
let tokenWorkerError: string;
let tokenWorkerReviews: string;
let tokenClientHistories: string;

beforeAll(async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "testing2" });

    tokenClient = signToken({ _id: `66dfc117ebbee2647f672ac3` });
    tokenWorker = signToken({ _id: `66dfc17bebbee2647f672acf` });
    tokenClientError = signToken({ _id: `66dfd17ce534116f78e27b14` });
    tokenWorkerError = signToken({ _id: `66dfe5bee534116f78e27b3f` });
    tokenClientHistories = signToken({ _id: `66dbf94e7acdd4f4421b3b2a` });
    tokenWorkerReviews = signToken({ _id: `66dc09e06f4066bc1defb4bf` });
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

describe(`GET /clients/profile`, () => {
  describe(`Success`, () => {
    test(`Success Get Client Profile 200`, async () => {
      const response = await request(app).get(`/clients/profile`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/clients/profile`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/clients/profile`).set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`GET /workers/profile`, () => {
  describe(`Success`, () => {
    test(`Success Get Worker Profile 200`, async () => {
      const response = await request(app).get(`/workers/profile`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 404, Profile Worker Not Found`, async () => {
      const response = await request(app).get(`/workers/profile`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/workers/profile`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/workers/profile`).set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`GET /workers/profile/reviews`, () => {
  describe(`Success`, () => {
    test(`Success Get Worker's reviews 200`, async () => {
      const response = await request(app).get(`/workers/profile/reviews`).set(`Authorization`, `Bearer ${tokenWorkerReviews}`);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 404, Worker Not Found`, async () => {
      const response = await request(app).get(`/workers/profile/reviews`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/workers/profile/reviews`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/workers/profile/reviews`).set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`GET /profile/histories`, () => {
  describe(`Success`, () => {
    test(`Success Get Client transaction histories 200`, async () => {
      const response = await request(app).get(`/profile/histories`).set(`Authorization`, `Bearer ${tokenClientHistories}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 404, Transaction Histories Not Found`, async () => {
      const response = await request(app).get(`/profile/histories`).set(`Authorization`, `Bearer ${tokenClientError}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/profile/histories`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/profile/histories`).set(`Authorization`, `Bearer ${tokenClientHistories}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`GET /profile/wallet`, () => {
  describe(`Success`, () => {
    test(`Success Get User Wallet 200`, async () => {
      const response = await request(app).get(`/profile/wallet`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`_id`, expect.any(String));
      expect(response.body).toHaveProperty(`amount`, expect.any(Number));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 404, Worker Not Found`, async () => {
      const response = await request(app).get(`/profile/wallet`).set(`Authorization`, `Bearer ${tokenClientError}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/profile/wallet`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/profile/wallet`).set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`PATCH /clients/profile`, () => {
  describe(`Success`, () => {
    test(`Success Update Client Profile 200`, async () => {
      const response = await request(app)
        .patch(`/clients/profile`)
        .field({
          name: `Muhammad Naufaldillah`,
          dateOfBirth: `2000-11-16`,
          address: `Sukolilo, Surabaya`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Successfully updated profile`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 404, Client Profile Not Found`, async () => {
      const response = await request(app)
        .patch(`/clients/profile`)
        .field({
          name: `Albert Tan`,
          dateOfBirth: `2000-11-16`,
          address: `Keputih, Surabaya`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClientError}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    // test(`Failed 401, Unauthenticated No Token`, async () => {
    //     const response = await request(app)
    //         .patch(`/clients/profile`)
    //         .field({
    //             name: `Muhammad Naufaldillah`,
    //             dateOfBirth: `2000-11-16`,
    //             address: `Sukolilo, Surabaya`
    //         })
    //         .attach(`image`, `./src/files/test1.jpg`)

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })

    // test(`Failed 401, Unauthenticated Invalid Token`, async () => {
    //     const response = await request(app)
    //         .patch(`/clients/profile`)
    //         .field({
    //             name: `Muhammad Naufaldillah`,
    //             dateOfBirth: `2000-11-16`,
    //             address: `Sukolilo, Surabaya`
    //         })
    //         .attach(`image`, `./src/files/test1.jpg`)
    //         .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })
  });
});

describe(`PATCH /workers/profile`, () => {
  describe(`Success`, () => {
    test(`Success Update Worker Profile 200`, async () => {
      const response = await request(app)
        .patch(`/workers/profile`)
        .field({
          name: `Frank Lim`,
          dateOfBirth: `2000-11-14`,
          address: `Singkawang Barat, Singkawang`,
        })
        .attach(`image`, `./src/files/test2.jpg`)
        .set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Successfully updated profile`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 404, Client Profile Not Found`, async () => {
      const response = await request(app)
        .patch(`/workers/profile`)
        .field({
          name: `David Lee`,
          dateOfBirth: `2000-11-15`,
          address: `Paris, Surabaya`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenWorkerError}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    // test(`Failed 401, Unauthenticated No Token`, async () => {
    //     const response = await request(app)
    //         .patch(`/workers/profile`)
    //         .field({
    //             name: `Frank Lim`,
    //             dateOfBirth: `2000-11-14`,
    //             address: `Singkawang Barat, Singkawang`
    //         })
    //         .attach(`image`, `./src/files/test2.jpg`)

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })

    // test(`Failed 401, Unauthenticated Invalid Token`, async () => {
    //     const response = await request(app)
    //         .patch(`/workers/profile`)
    //         .field({
    //             name: `Frank Lim`,
    //             dateOfBirth: `2000-11-14`,
    //             address: `Singkawang Barat, Singkawang`
    //         })
    //         .attach(`image`, `./src/files/test1.jpg`)
    //         .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })
  });
});
