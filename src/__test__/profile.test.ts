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
import { Transaction } from "../models/transaction";
import { Review } from "../models/review";

const MONGO_URI : any = process.env.MONGO_URI;
let tokenClient : string;
let tokenWorker : string;
let tokenClientError : string;
let tokenWorkerError : string;
let tokenWorkerReviews : string;
let tokenClientHistories : string;

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
    }
]

const invalidWalletSeed = [
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

const transactionSeed = [
    {
        _id: new ObjectId(),
        clientId: userSeed[0]._id,
        workerId: userSeed[2]._id,
        jobId: jobSeed[0]._id
    },
    {
        _id: new ObjectId(),
        clientId: userSeed[0]._id,
        workerId: userSeed[2]._id,
        jobId: jobSeed[1]._id
    }
]

const reviewSeed = [
    {
        _id: new ObjectId(),
        jobId: jobSeed[0]._id,
        clientId: userSeed[0]._id,
        description: `He's quick.`,
        rating: 4
    },
    {
        _id: new ObjectId(),
        jobId: jobSeed[1]._id,
        clientId: userSeed[0]._id,
        description: `Very reliable`,
        rating: 4
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
        await Transaction.insertMany(transactionSeed);
        await Review.insertMany(reviewSeed);

        tokenClient = signToken({ _id: String(userSeed[0]._id) });
        tokenWorker = signToken({ _id: String(userSeed[2]._id) });
        tokenClientError = signToken({ _id: String(userSeed[1]._id) });
        tokenWorkerError = signToken({ _id: `66dfe5bee534116f78e27b3f` });
        tokenClientHistories = signToken({ _id: `66dbf94e7acdd4f4421b3b2a` });
        tokenWorkerReviews = signToken({ _id: `66dc09e06f4066bc1defb4bf` });
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        await Review.deleteMany();
        await Transaction.deleteMany();
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

describe(`GET /clients/profile`, () => {
    describe(`Success`, () => {
        test(`Success Get Client Profile 200`, async () => {
            const response = await request(app)
                .get(`/clients/profile`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/clients/profile`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/clients/profile`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`GET /workers/profile`, () => {
    describe(`Success`, () => {
        test(`Success Get Worker Profile 200`, async () => {
            const response = await request(app)
                .get(`/workers/profile`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 404, Profile Worker Not Found`, async () => {
            const response = await request(app)
                .get(`/workers/profile`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/workers/profile`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/workers/profile`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`GET /workers/profile/reviews`, () => {
    describe(`Success`, () => {
        test(`Success Get Worker's reviews 200`, async () => {
            const response = await request(app)
                .get(`/workers/profile/reviews`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);   
                
            expect(response.body).toBeInstanceOf(Array);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/workers/profile/reviews`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/workers/profile/reviews`)
                .set(`Authorization`, `Bearer ${tokenWorker}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`GET /profile/histories`, () => {
    describe(`Success`, () => {
        test(`Success Get Client transaction histories 200`, async () => {
            const response = await request(app)
                .get(`/profile/histories`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })
        
        test(`Success Get Client transaction histories filtered by week 200`, async () => {
            const response = await request(app)
                .get(`/profile/histories?sort=desc&filter=week`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })

        test(`Success Get Client transaction histories by month 200`, async () => {
            const response = await request(app)
                .get(`/profile/histories?filter=year`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`_id`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 404, Transaction Histories Not Found`, async () => {
            const response = await request(app)
                .get(`/profile/histories`)
                .set(`Authorization`, `Bearer ${tokenClientError}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/profile/histories`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/profile/histories`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`GET /profile/wallet`, () => {
    describe(`Success`, () => {
        test(`Success Get User Wallet 200`, async () => {
            const response = await request(app)
                .get(`/profile/wallet`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`_id`, expect.any(String));
            expect(response.body).toHaveProperty(`amount`, expect.any(Number));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 404, Wallet Not Found`, async () => {
            const response = await request(app)
                .get(`/profile/wallet`)
                .set(`Authorization`, `Bearer ${tokenClientError}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/profile/wallet`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })

        test(`Failed 401, Unauthenticated Invalid Token`, async () => {
            const response = await request(app)
                .get(`/profile/wallet`)
                .set(`Authorization`, `Bearer ${tokenClient}fwfbda`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid access token`);
        })
    })
})

describe(`PATCH /clients/profile`, () => {
    describe(`Success`, () => {
        test(`Success Update Client Profile 200`, async () => {
            const response = await request(app)
                .patch(`/clients/profile`)
                .field({
                    name: `Muhammad Naufaldillah`,
                    dateOfBirth: `2000-11-16`,
                    address: `Sukolilo, Surabaya`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClient}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Successfully updated profile`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 404, Client Profile Not Found`, async () => {
            const response = await request(app)
                .patch(`/clients/profile`)
                .field({
                    name: `Albert Tan`,
                    dateOfBirth: `2000-11-16`,
                    address: `Keputih, Surabaya`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

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
    })
})

describe(`PATCH /workers/profile`, () => {
    describe(`Success`, () => {
        test(`Success Update Worker Profile 200`, async () => {
            const response = await request(app)
                .patch(`/workers/profile`)
                .field({
                    name: `Frank Lim`,
                    dateOfBirth: `2000-11-14`,
                    address: `Singkawang Barat, Singkawang`
                })
                .attach(`image`, `./src/files/test2.jpg`)
                .set(`Authorization`, `Bearer ${tokenWorker}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Successfully updated profile`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 404, Worker Profile Not Found`, async () => {
            const response = await request(app)
                .patch(`/workers/profile`)
                .field({
                    name: `David Lee`,
                    dateOfBirth: `2000-11-15`,
                    address: `Paris, Surabaya`
                })
                .attach(`image`, `./src/files/test1.jpg`)
                .set(`Authorization`, `Bearer ${tokenClientError}`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Data Not Found!`);
        })

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
    })
})

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