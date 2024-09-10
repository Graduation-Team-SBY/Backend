import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";

const MONGO_URI : any = process.env.MONGO_URI;
let tokenClient : string;
let tokenWorker : string;
let tokenClientEmpty : string;
let tokenWorkerEmpty : string;

beforeAll(async () => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "testing"});

        tokenClient = signToken({ _id: `66dfc117ebbee2647f672ac3` });
        tokenWorker = signToken({ _id: `66dfc17bebbee2647f672acf` });
        tokenClientEmpty = signToken({ _id: `66dfc120ebbee2647f672ac9` });
        tokenWorkerEmpty = signToken({ _id: `66dfc182ebbee2647f672ad5` });
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
                    addressNotes: `Ketemu di Lobby`
                })
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Job is successfully created!`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, Client Don't Have Enough Money`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/belanja`)
                .send({
                    fee: 10000000,
                    description: `Beliin Red Bull`,
                    address: `Sinarmas Plaza, Surabaya`,
                    addressNotes: `Ketemu di Lobby`
                })
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `You don\'t have enough money!`);
        })

        test(`Failed 400, Client Not Complete The Profile`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/belanja`)
                .send({
                    fee: 10000,
                    description: `Beliin Red Bull`,
                    address: `Sinarmas Plaza, Surabaya`,
                    addressNotes: `Ketemu di Lobby`
                })
                .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Fill in your profile first!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/belanja`)
                .send({
                    fee: 10000000,
                    description: `Beliin Red Bull`,
                    address: `Sinarmas Plaza, Surabaya`,
                    addressNotes: `Ketemu di Lobby`
                })

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/belanja`)
                .send({
                    fee: 10000000,
                    description: `Beliin Red Bull`,
                    address: `Sinarmas Plaza, Surabaya`,
                    addressNotes: `Ketemu di Lobby`
                })
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`POST /clients/jobs/bersih`, () => {
    describe(`Success`, () => {
        test(`Success Creating New Bersih Job 201`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/bersih`)
                .field({
                    fee: 1000,
                    description: `Bersihkan Kost`,
                    address: `Bumi Marina Emas, Surabaya`,
                    addressNotes: `Ketemu di Gerbang Kuning`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Job is successfully created!`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, No Image Uploaded`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/bersih`)
                .field({
                    fee: 1000,
                    description: `Bersihkan Kost`,
                    address: `Bumi Marina Emas, Surabaya`,
                    addressNotes: `Ketemu di Gerbang Kuning`
                })
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Failed to upload image, please try again!`);
        })

        test(`Failed 400, Client Don't Have Enough Money`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/bersih`)
                .field({
                    fee: 10000000,
                    description: `Bersihkan Kost`,
                    address: `Bumi Marina Emas, Surabaya`,
                    addressNotes: `Ketemu di Gerbang Kuning`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `You don\'t have enough money!`);
        })

        test(`Failed 400, Client Not Complete The Profile`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/bersih`)
                .field({
                    fee: 1000,
                    description: `Bersihkan Kost`,
                    address: `Bumi Marina Emas, Surabaya`,
                    addressNotes: `Ketemu di Gerbang Kuning`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Fill in your profile first!`);
        })

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
    })
})

describe(`GET /client/jobs/active`, () => {
    describe(`Success`, () => {
        test(`Success Get Active Job List 200`, async () => {
            const response = await request(app)
                .get(`/clients/jobs/active`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })

        test(`Success Get Active Job List With ascending sort and Nitip category 200`, async () => {
            const response = await request(app)
                .get(`/clients/jobs/active?sort=asc&category=Nitip`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })

        test(`Success Get Active Job List With descending sort 200`, async () => {
            const response = await request(app)
                .get(`/clients/jobs/active?sort=desc`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/clients/jobs/active`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/clients/jobs/active`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`GET /workers/jobs/worker`, () => {
    describe(`Success`, () => {
        test(`Success Get All Job List 200`, async () => {
            const response = await request(app)
                .get(`/workers/jobs/worker`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })

        test(`Success Get All Job List With ascending sort and Nitip category 200`, async () => {
            const response = await request(app)
                .get(`/workers/jobs/worker?sort=asc&category=Nitip`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })

        test(`Success Get All Job List With descending sort 200`, async () => {
            const response = await request(app)
                .get(`/workers/jobs/worker?sort=desc`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/workers/jobs/worker`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/workers/jobs/worker`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 403, Client User attempting to worker routes`, async () => {
            const response = await request(app)
                .get(`/workers/jobs/worker`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})

describe(`GET /jobs/:job`, () => {
    describe(`Success`, () => {
        test(`Success Get Job Detail 200`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .get(`/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 404, Job Not Found`, async () => {
            const jobId = `66dea5d32974b4cd98e9c323`
            const response = await request(app)
                .get(`/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .get(`/jobs/${jobId}`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .get(`/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`GET /workers/jobs/:job`, () => {
    describe(`Success`, () => {
        test(`Success Get Job Detail 200`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, Worker Not Complete The Profile`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorkerEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Fill in your profile first!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 403, Client User attempting to worker routes`, async () => {
            const jobId = `66dea5d32974b4cd98e9c350`
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})