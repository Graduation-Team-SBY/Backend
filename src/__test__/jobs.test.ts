import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";

const MONGO_URI: any = process.env.MONGO_URI;
let tokenClient: string;
let tokenWorker: string;
let tokenClientEmpty: string;
let tokenWorkerEmpty: string;
let tokenClientPickJob: string;
let tokenWorkerReviews: string;

beforeAll(async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "testing2" });

    tokenClient = signToken({ _id: `66dfc117ebbee2647f672ac3` });
    tokenWorker = signToken({ _id: `66dfc17bebbee2647f672acf` });
    tokenClientEmpty = signToken({ _id: `66dfc120ebbee2647f672ac9` });
    tokenWorkerEmpty = signToken({ _id: `66dfc182ebbee2647f672ad5` });
    tokenClientPickJob = signToken({ _id: `66dc034d2efcced67245fdad` });
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

describe(`POST /clients/jobs/belanja`, () => {
  describe(`Success`, () => {
    test(`Success Creating New Belanja Job 201`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/belanja`)
        .send({
          fee: 1000,
          description: `Beliin Red Bull`,
          address: `Sinarmas Plaza, Surabaya`,
          addressNotes: `Ketemu di Lobby`,
        })
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Job is successfully created!`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, Client Don't Have Enough Money`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/belanja`)
        .send({
          fee: 10000000,
          description: `Beliin Red Bull`,
          address: `Sinarmas Plaza, Surabaya`,
          addressNotes: `Ketemu di Lobby`,
        })
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `You don\'t have enough money!`);
    });

    test(`Failed 400, Client Not Complete The Profile`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/belanja`)
        .send({
          fee: 10000,
          description: `Beliin Red Bull`,
          address: `Sinarmas Plaza, Surabaya`,
          addressNotes: `Ketemu di Lobby`,
        })
        .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Fill in your profile first!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).post(`/clients/jobs/belanja`).send({
        fee: 10000000,
        description: `Beliin Red Bull`,
        address: `Sinarmas Plaza, Surabaya`,
        addressNotes: `Ketemu di Lobby`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/belanja`)
        .send({
          fee: 10000000,
          description: `Beliin Red Bull`,
          address: `Sinarmas Plaza, Surabaya`,
          addressNotes: `Ketemu di Lobby`,
        })
        .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`POST /clients/jobs/bersih`, () => {
  describe(`Success`, () => {
    test(`Success Creating New Bersih Job 201`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/bersih`)
        .field({
          fee: 1000,
          description: `Bersihkan Kost`,
          address: `Bumi Marina Emas, Surabaya`,
          addressNotes: `Ketemu di Gerbang Kuning`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Job is successfully created!`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, No Image Uploaded`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/bersih`)
        .field({
          fee: 1000,
          description: `Bersihkan Kost`,
          address: `Bumi Marina Emas, Surabaya`,
          addressNotes: `Ketemu di Gerbang Kuning`,
        })
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Failed to upload image, please try again!`);
    });

    test(`Failed 400, Client Don't Have Enough Money`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/bersih`)
        .field({
          fee: 10000000,
          description: `Bersihkan Kost`,
          address: `Bumi Marina Emas, Surabaya`,
          addressNotes: `Ketemu di Gerbang Kuning`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `You don\'t have enough money!`);
    });

    test(`Failed 400, Client Not Complete The Profile`, async () => {
      const response = await request(app)
        .post(`/clients/jobs/bersih`)
        .field({
          fee: 1000,
          description: `Bersihkan Kost`,
          address: `Bumi Marina Emas, Surabaya`,
          addressNotes: `Ketemu di Gerbang Kuning`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Fill in your profile first!`);
    });

    // test(`Failed 401, Unauthenticated No Token`, async () => {
    //     const response = await request(app)
    //         .post(`/clients/jobs/belanja`)
    //         .field({
    //             fee: 1000,
    //             description: `Bersihkan Kost`,
    //             address: `Bumi Marina Emas, Surabaya`,
    //             addressNotes: `Ketemu di Gerbang Kuning`
    //         })
    //         .attach(`image`, `./src/files/test1.jpg`)

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })

    // test(`Failed 401, Unauthenticated Invalid Token`, async () => {
    //     const response = await request(app)
    //         .post(`/clients/jobs/belanja`)
    //         .field({
    //             fee: 1000,
    //             description: `Bersihkan Kost`,
    //             address: `Bumi Marina Emas, Surabaya`,
    //             addressNotes: `Ketemu di Gerbang Kuning`
    //         })
    //         .attach(`image`, `./src/files/test1.jpg`)
    //         .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })
  });
});

describe(`GET /client/jobs/active`, () => {
  describe(`Success`, () => {
    test(`Success Get Active Job List 200`, async () => {
      const response = await request(app).get(`/clients/jobs/active`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });

    test(`Success Get Active Job List With ascending sort and Nitip category 200`, async () => {
      const response = await request(app).get(`/clients/jobs/active?sort=asc&category=Nitip`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });

    test(`Success Get Active Job List With descending sort 200`, async () => {
      const response = await request(app).get(`/clients/jobs/active?sort=desc`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/clients/jobs/active`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/clients/jobs/active`).set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`GET /workers/jobs/worker`, () => {
  describe(`Success`, () => {
    test(`Success Get All Job List 200`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });

    test(`Success Get All Job List With ascending sort and Nitip category 200`, async () => {
      const response = await request(app).get(`/workers/jobs/worker?sort=asc&category=Nitip`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });

    test(`Success Get All Job List With descending sort 200`, async () => {
      const response = await request(app).get(`/workers/jobs/worker?sort=desc`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`).set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 403, Client User attempting to worker routes`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });
  });
});

describe(`GET /jobs/:job`, () => {
  describe(`Success`, () => {
    test(`Success Get Job Detail 200`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).get(`/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 404, Job Not Found`, async () => {
      const jobId = `66dea5d32974b4cd98e9c323`;
      const response = await request(app).get(`/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).get(`/jobs/${jobId}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).get(`/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`POST /workers/jobs/:job`, () => {
  describe(`Success`, () => {
    test(`Success Apply for a job 200`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).post(`/workers/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, Worker Not Complete The Profile`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).post(`/workers/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenWorkerEmpty}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Fill in your profile first!`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).post(`/workers/jobs/${jobId}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).post(`/workers/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 403, Client User attempting to worker routes`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).post(`/workers/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });
  });
});

describe(`GET /clients/jobs/:jobId/workers`, () => {
  describe(`Success`, () => {
    test(`Success Get Candidate Worker list 200`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).get(`/clients/jobs/${jobId}/workers`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).get(`/clients/jobs/${jobId}/workers`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).get(`/clients/jobs/${jobId}/workers`).set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });
  });
});

describe(`PATCH /clients/jobs/:jobId/:workerId`, () => {
  describe(`Success`, () => {
    test(`Success Update Job Status and Pick Worker 200`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const workerId = `66dfc17bebbee2647f672acf`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/${workerId}`).set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Successfully picked worker`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, Already Picked Worker For The Job`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const workerIdError = `666dc09e06f4066bc1defb4bf`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/${workerIdError}`).set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `You already picked a worker before`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const workerId = `66dfc17bebbee2647f672acf`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/${workerId}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).get(`/clients/jobs/${jobId}/workers`).set(`Authorization`, `Bearer ${tokenClientPickJob}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 404, Job Not Found`, async () => {
      const jobIdError = `66dea5d32974b4cd98e9c333`;
      const workerId = `66dfc17bebbee2647f672acf`;
      const response = await request(app).patch(`/clients/jobs/${jobIdError}/${workerId}`).set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 403, Other Client Attempt to pick a worker`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const workerId = `66dfc17bebbee2647f672acf`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/${workerId}`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });
  });
});

describe(`GET /workers/jobs/worker`, () => {
  describe(`Success`, () => {
    test(`Success Get Active Job List 200`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`).set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 403, Client User attempting to worker routes`, async () => {
      const response = await request(app).get(`/workers/jobs/worker`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });
  });
});

describe(`DELETE /clients/jobs/:jobId`, () => {
  describe(`Success`, () => {
    test(`Success Get Active Job List 200`, async () => {
      const jobId = `66e0006c28d9b5d515d2a50a`;
      const response = await request(app).delete(`/clients/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Job is successfully canceled!`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 401, Unauthenticated No Token`, async () => {
      const jobId = `66e0006c28d9b5d515d2a50a`;
      const response = await request(app).delete(`/clients/jobs/${jobId}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const jobId = `66e0006c28d9b5d515d2a50a`;
      const response = await request(app).delete(`/clients/jobs/${jobId}`).set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 404, Job Not Found`, async () => {
      const jobIdError = `66dea5d32974b4cd98e9c333`;
      const response = await request(app).delete(`/clients/jobs/${jobIdError}`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 403, Attempting to cancel other client job order`, async () => {
      const jobIdError = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).delete(`/clients/jobs/${jobIdError}`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });

    test(`Failed 403, Attempting to cancel ongoing job order`, async () => {
      const jobIdError = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).delete(`/clients/jobs/${jobIdError}`).set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `You cannot cancel this job order!`);
    });
  });
});

describe(`PATCH /workers/jobs/:jobId/worker`, () => {
  describe(`Success`, () => {
    test(`Success Update Job Status and Get Confirmation from Worker 200`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/workers/jobs/${jobId}/worker`).attach(`image`, `./src/files/test1.jpg`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Successfully update job status`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, No Image Upload`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/workers/jobs/${jobId}/worker`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Failed to upload image, please try again!`);
    });

    test(`Failed 404, Job Status Not Found`, async () => {
      const jobIdError = `66e0006c28d9b5d515d2a517`;
      const response = await request(app).patch(`/clients/jobs/${jobIdError}/worker`).attach(`image`, `./src/files/test1.jpg`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 404, Job Not Found`, async () => {
      const jobIdError = `66e0006c28d9b5d515d2a557`;
      const response = await request(app).patch(`/clients/jobs/${jobIdError}/worker`).attach(`image`, `./src/files/test1.jpg`).set(`Authorization`, `Bearer ${tokenWorker}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    // test(`Failed 401, Unauthenticated No Token`, async () => {
    //     const jobId = `66dea5d32974b4cd98e9c350`
    //     const response = await request(app)
    //         .patch(`/workers/jobs/${jobId}/worker`)
    //         .attach(`image`, `./src/files/test1.jpg`)

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })

    // test(`Failed 401, Unauthenticated Invalid Token`, async () => {
    //     const jobId = `66dea5d32974b4cd98e9c350`
    //     const response = await request(app)
    //         .patch(`/workers/jobs/${jobId}/worker`)
    //         .attach(`image`, `./src/files/test1.jpg`)
    //         .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })

    test(`Failed 403, Other Client Attempt to enter worker endpoints`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/workers/jobs/${jobId}/worker`).attach(`image`, `./src/files/test1.jpg`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });

    test(`Failed 403, Other Worker Attempt to confirm a job`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/workers/jobs/${jobId}/worker`).attach(`image`, `./src/files/test1.jpg`).set(`Authorization`, `Bearer ${tokenWorkerReviews}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });
  });
});

describe(`PATCH /clients/jobs/:jobId/client`, () => {
  describe(`Success`, () => {
    test(`Success Update Job Status And Get Client Confirmation 200`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/client`).set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Successfully update job order status`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, Worker Haven\'t Confirmed Yet`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/client`).set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Worker haven\'t confirmed yet`);
    });

    test(`Failed 401, Unauthenticated No Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/client`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 401, Unauthenticated Invalid Token`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/client`).set(`Authorization`, `Bearer ${tokenClientPickJob}fwfbda`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    });

    test(`Failed 404, Job Not Found`, async () => {
      const jobIdError = `66dea5d32974b4cd98e9c333`;
      const response = await request(app).patch(`/clients/jobs/${jobIdError}/client`).set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 403, Attempting to confirm other client job order`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app).patch(`/clients/jobs/${jobId}/client`).set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });
  });
});

describe(`POST /clients/jobs/:jobId/review`, () => {
  describe(`Success`, () => {
    test(`Success Update Job Status And Get Client Confirmation 200`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app)
        .post(`/clients/jobs/${jobId}/review`)
        .field({
          description: `Hebat, Great Job!`,
          rating: 4,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Successfully created review`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, Worker Haven\'t Confirmed Yet`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app)
        .post(`/clients/jobs/${jobId}/review`)
        .field({
          description: `Hebat, Great Job!`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Please input the rating!`);
    });

    // test(`Failed 401, Unauthenticated No Token`, async () => {
    //     const jobId = `66dea5d32974b4cd98e9c350`
    //     const response = await request(app)
    //         .post(`/clients/jobs/${jobId}/review`)
    //         .field({
    //             description: `Hebat, Great Job!`
    //         })

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })

    // test(`Failed 401, Unauthenticated Invalid Token`, async () => {
    //     const jobId = `66dea5d32974b4cd98e9c350`
    //     const response = await request(app)
    //         .post(`/clients/jobs/${jobId}/review`)
    //         .field({
    //             description: `Hebat, Great Job!`
    //         })
    //         .set(`Authorization`, `Bearer ${tokenClientPickJob}fwfbda`);

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
    // })

    test(`Failed 404, Job Not Found`, async () => {
      const jobIdError = `66dea5d32974b4cd98e9c333`;
      const response = await request(app)
        .post(`/clients/jobs/${jobIdError}/review`)
        .field({
          description: `Hebat, Great Job!`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClientPickJob}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
    });

    test(`Failed 403, Attempting to confirm other client job order`, async () => {
      const jobId = `66dea5d32974b4cd98e9c350`;
      const response = await request(app)
        .post(`/clients/jobs/${jobId}/review`)
        .field({
          description: `Hebat, Great Job!`,
        })
        .attach(`image`, `./src/files/test1.jpg`)
        .set(`Authorization`, `Bearer ${tokenClient}`);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
    });
  });
});
