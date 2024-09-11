import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { signToken } from "../helpers/jwt";
import { hashPassword } from "../helpers/bcrypt";
import { ObjectId } from "mongodb";
import { User } from "../models/user";
import { Wallet } from "../models/wallet";
import { Profile } from "../models/profile";
import { WorkerProfile } from "../models/workerprofile";
import { Job } from "../models/job";
import { title } from "process";
import { JobStatus } from "../models/jobstatus";
import { JobRequest } from "../models/jobrequest";
import { Transaction } from "../models/transaction";

const MONGO_URI : any = process.env.MONGO_URI;
let tokenClient : string;
let tokenWorker : string;
let tokenClientEmpty : string;
let tokenWorkerEmpty : string;
let tokenClientPickJob : string;
let tokenWorkerReviews : string;

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

const jobStatusSeed = [
    {
        _id: new ObjectId(),
        jobId: jobSeed[3]._id,
        isWorkerConfirmed: false,
        isClientConfirmed: true,
        isDone: false
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
        await JobStatus.insertMany(jobStatusSeed)

        tokenClient = signToken({ _id: String(userSeed[0]._id) });
        tokenWorker = signToken({ _id: String(userSeed[2]._id) });
        tokenClientEmpty = signToken({ _id: String(userSeed[1]._id) });
        tokenWorkerEmpty = signToken({ _id: String(userSeed[3]._id) });
        tokenClientPickJob = signToken({ _id: `66dc034d2efcced67245fdad`})
        tokenWorkerReviews = signToken({ _id: `66dc09e06f4066bc1defb4bf` });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await Transaction.deleteMany();
        await JobStatus.deleteMany();
        await JobRequest.deleteMany();
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

describe(`POST /clients/jobs/belanja`, () => {
    describe(`Success`, () => {
        test(`Success Creating New Belanja Job 201`, async () => {
            const response = await request(app)
                .post(`/clients/jobs/belanja`)
                .send({
                    title: "Red Bull",
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
                    title: "Red Bull",
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
                    title: "Red Bull",
                    fee: 1000,
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
                    title: "Red Bull",
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
                    title: "Red Bull",
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
                    title: "Pembersihan Kost",
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
                    title: "Pembersihan Kost",
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
                    title: "Pembersihan Kost",
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
                    title: "Pembersihan Kost",
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
            const jobId = String(jobSeed[2]._id);
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
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .get(`/jobs/${jobId}`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .get(`/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`POST /workers/jobs/:jobId`, () => {
    describe(`Success`, () => {
        test(`Success Apply for a job 200`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Successfully applied to this job!`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, Worker already applied for the job`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `You already applied to this job`);
        })

        test(`Failed 400, Worker Not Complete The Profile`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorkerEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Fill in your profile first!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 403, Client User attempting to worker routes`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/workers/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})

describe(`GET /clients/jobs/:jobId/workers`, () => {
    describe(`Success`, () => {
        test(`Success Get Candidate Worker list 200`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .get(`/clients/jobs/${jobId}/workers`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .get(`/clients/jobs/${jobId}/workers`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .get(`/clients/jobs/${jobId}/workers`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`PATCH /clients/jobs/:jobId/:workerId`, () => {
    describe(`Success`, () => {
        test(`Success Update Job Status and Pick Worker 200`, async () => {
            const jobId = String(jobSeed[2]._id);
            const workerId = String(userSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/${workerId}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Successfully picked worker`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, Already Picked Worker For The Job`, async () => {
            const jobId = String(jobSeed[1]._id);
            const workerIdError = String(userSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/${workerIdError}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `You already picked a worker before`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const workerId = String(userSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/${workerId}`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const workerId = String(userSeed[2]._id);
            const response = await request(app)
                .get(`/clients/jobs/${jobId}/${workerId}`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 404, Job Not Found`, async () => {
            const jobIdError = `66dea5d32974b4cd98e9c333`
            const workerId = String(userSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobIdError}/${workerId}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 403, Other Client Attempt to pick a worker`, async () => {
            const jobId = String(jobSeed[2]._id);
            const workerId = String(userSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/${workerId}`)
                .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})

describe(`GET /workers/jobs`, () => {
    describe(`Success`, () => {
        test(`Success Get Active Job List 200`, async () => {
            const response = await request(app)
                .get(`/workers/job`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/workers/job`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/workers/job`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 403, Client User attempting to worker routes`, async () => {
            const response = await request(app)
                .get(`/workers/job`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})

describe(`DELETE /clients/jobs/:jobId`, () => {
    describe(`Success`, () => {
        test(`Success Get Active Job List 200`, async () => {
            const jobId = String(jobSeed[4]._id);
            const response = await request(app)
                .delete(`/clients/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Job is successfully canceled!`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const jobId = String(jobSeed[4]._id);
            const response = await request(app)
                .delete(`/clients/jobs/${jobId}`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = String(jobSeed[4]._id);
            const response = await request(app)
                .delete(`/clients/jobs/${jobId}`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 404, Job Not Found`, async () => {
            const jobIdError = `66dea5d32974b4cd98e9c333`
            const response = await request(app)
                .delete(`/clients/jobs/${jobIdError}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 403, Attempting to cancel other client job order`, async () => {
            const jobIdError = String(jobSeed[3]._id);
            const response = await request(app)
                .delete(`/clients/jobs/${jobIdError}`)
                .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })

        test(`Failed 403, Attempting to cancel ongoing job order`, async () => {
            const jobIdError = String(jobSeed[2]._id)
            const response = await request(app)
                .delete(`/clients/jobs/${jobIdError}`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `You cannot cancel this job order!`);
        })
    })
})

describe(`PATCH /workers/jobs/:jobId/worker`, () => {
    describe(`Success`, () => {
        test(`Success Update Job Status and Get Confirmation from Worker 200`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/workers/jobs/${jobId}/worker`)
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Successfully update job status`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, No Image Upload`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/workers/jobs/${jobId}/worker`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Failed to upload image, please try again!`);
        })

        test(`Failed 404, Job Status Not Found`, async () => {
            const jobIdError = `66e0006c28d9b5d515d2a517`;
            const response = await request(app)
                .patch(`/clients/jobs/${jobIdError}/worker`)
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 404, Job Not Found`, async () => {
            const jobIdError = `66e0006c28d9b5d515d2a557`;
            const response = await request(app)
                .patch(`/clients/jobs/${jobIdError}/worker`)
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        // test(`Failed 401, Unauthenticated No Token`, async () => {
        //     const jobId = String(jobSeed[2]._id);
        //     const response = await request(app)
        //         .patch(`/workers/jobs/${jobId}/worker`)
        //         .attach(`image`, `./src/files/test1.jpg`)

        //     expect(response.body).toBeInstanceOf(Object);
        //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        // })

        // test(`Failed 401, Unauthenticated Invalid Token`, async () => {
        //     const jobId = String(jobSeed[2]._id);
        //     const response = await request(app)
        //         .patch(`/workers/jobs/${jobId}/worker`)
        //         .attach(`image`, `./src/files/test1.jpg`)
        //         .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

        //     expect(response.body).toBeInstanceOf(Object);
        //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        // })

        test(`Failed 403, Other Client Attempt to enter worker endpoints`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/workers/jobs/${jobId}/worker`)
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })

        test(`Failed 403, Other Worker Attempt to confirm a job`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/workers/jobs/${jobId}/worker`)
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenWorkerEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})

describe(`PATCH /clients/jobs/:jobId/client`, () => {
    describe(`Success`, () => {
        test(`Success Update Job Status And Get Client Confirmation 200`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/client`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Successfully update job order status`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, Worker Haven\'t Confirmed Yet`, async () => {
            const jobId = String(jobSeed[3]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/client`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Worker haven\'t confirmed yet`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/client`)

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/client`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 404, Job Not Found`, async () => {
            const jobIdError = `66dea5d32974b4cd98e9c333`
            const response = await request(app)
                .patch(`/clients/jobs/${jobIdError}/client`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 403, Attempting to confirm other client job order`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .patch(`/clients/jobs/${jobId}/client`)
                .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})

describe(`POST /clients/jobs/:jobId/review`, () => {
    describe(`Success`, () => {
        test(`Success Update Job Status And Get Client Confirmation 200`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/clients/jobs/${jobId}/review`)
                .field({
                    description: `Hebat, Great Job!`,
                    rating: 4
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Successfully created review`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, No Rating Input`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/clients/jobs/${jobId}/review`)
                .field({
                    description: `Hebat, Great Job!`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Please input the rating!`);
        })

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
        //         .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

        //     expect(response.body).toBeInstanceOf(Object);
        //     expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        // })

        test(`Failed 404, Job Not Found`, async () => {
            const jobIdError = `66dea5d32974b4cd98e9c333`
            const response = await request(app)
                .post(`/clients/jobs/${jobIdError}/review`)
                .field({
                    description: `Hebat, Great Job!`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 403, Attempting to review other client job order`, async () => {
            const jobId = String(jobSeed[2]._id);
            const response = await request(app)
                .post(`/clients/jobs/${jobId}/review`)
                .field({
                    description: `Hebat, Great Job!`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClientEmpty}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Insufficient privileges to do this action`);
        })
    })
})