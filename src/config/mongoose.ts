import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI as string;

export const gooseConnect = async () => {
    await mongoose.connect(MONGO_URI, { dbName: 'testing' })
}