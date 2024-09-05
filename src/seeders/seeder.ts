const mongoose = require("mongoose");
const { users, profiles, wallets, categories, jobs, jobStatus, jobRequests, transactions, workerProfiles, reviews, chats } = require("./data");

const UserSchema = new mongoose.Schema({
  email: String,
  phoneNumber: String,
  password: String,
  isWorker: Boolean,
});

const ProfileSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  profilePicture: String,
  address: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const WalletSchema = new mongoose.Schema({
  amount: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
});

const JobSchema = new mongoose.Schema({
  description: String,
  address: String,
  fee: Number,
  images: [String],
  chatId: mongoose.Schema.Types.ObjectId,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const JobStatusSchema = new mongoose.Schema({
  workerConfirmed: Boolean,
  clientConfirmed: Boolean,
  isDone: Boolean,
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
});

const JobRequestSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const TransactionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobsId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
});

const WorkerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bio: String,
  joinDate: Date,
  rating: Number,
});

const ReviewSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  description: String,
  rating: Number,
  images: String,
});

const ChatSchema = new mongoose.Schema({
  contents: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      createdAt: Date,
    },
  ],
});

const User = mongoose.model("User", UserSchema);
const Profile = mongoose.model("Profile", ProfileSchema);
const Wallet = mongoose.model("Wallet", WalletSchema);
const Category = mongoose.model("Category", CategorySchema);
const Job = mongoose.model("Job", JobSchema);
const JobStatus = mongoose.model("JobStatus", JobStatusSchema);
const JobRequest = mongoose.model("JobRequest", JobRequestSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);
const WorkerProfile = mongoose.model("WorkerProfile", WorkerProfileSchema);
const Review = mongoose.model("Review", ReviewSchema);
const Chat = mongoose.model("Chat", ChatSchema);

async function seedDatabase() {
  try {
    // Clear existing data
    // await User.deleteMany();
    // await Profile.deleteMany();
    // await Wallet.deleteMany();
    // await Category.deleteMany();
    // await Job.deleteMany();
    // await JobStatus.deleteMany();
    // await JobRequest.deleteMany();
    // await Transaction.deleteMany();
    // await WorkerProfile.deleteMany();
    // await Review.deleteMany();
    // await Chat.deleteMany();

    // Seed data
    await User.insertMany(users);
    await Profile.insertMany(profiles);
    await Wallet.insertMany(wallets);
    await Category.insertMany(categories);
    await Job.insertMany(jobs);
    await JobStatus.insertMany(jobStatus);
    await JobRequest.insertMany(jobRequests);
    await Transaction.insertMany(transactions);
    await WorkerProfile.insertMany(workerProfiles);
    await Review.insertMany(reviews);
    await Chat.insertMany(chats);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
