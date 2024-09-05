import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  email: string;
  phoneNumber: string;
  password: string;
  isWorker?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserSchema = Omit<IUser, "_id">;

export interface IProfile {
  _id: ObjectId;
  name?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  address?: string;
  userId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IProfileSchema = Omit<IProfile, "_id">;

export interface IWallet {
  _id: ObjectId;
  amount: number;
  userId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IWalletSchema = Omit<IWallet, "_id">;

export interface ICategory {
  _id: ObjectId;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ICategorySchema = Omit<ICategory, "_id">;

export interface IJob {
  _id: ObjectId;
  description: string;
  address: string;
  fee: number;
  images?: string[];
  clientId: ObjectId;
  workerId?: ObjectId;
  categoryId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IJobSchema = Omit<IJob, "_id">;

export interface IJobRequest {
  _id: ObjectId;
  jobId: ObjectId;
  workerId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IJobRequestSchema = Omit<IJobRequest, "_id">;

export interface IReview {
  _id: ObjectId;
  transactionId: ObjectId;
  description?: string;
  rating: number;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type IReviewSchema = Omit<IReview, "_id">;

export interface IWorkerProfile {
  _id: ObjectId;
  userId: ObjectId;
  bio: string;
  joinDate: Date;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IWorkerProfileSchema = Omit<IWorkerProfile, "_id">;

export interface ITransaction {
  _id: ObjectId;
  clientId: ObjectId;
  workerId: ObjectId;
  jobId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ITransactionSchema = Omit<ITransaction, "_id">;

export interface IJobStatus {
  _id: ObjectId;
  jobId: ObjectId;
  isWorkerConfirmed?: boolean;
  isClientConfirmed?: boolean;
  isDone?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IJobStatusSchema = Omit<IJobStatus, "_id">;
