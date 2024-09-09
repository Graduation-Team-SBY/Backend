import { ObjectId } from "mongodb";
import { Request } from "express";

export interface IUser {
  _id: ObjectId;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
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
  amount?: number;
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
  coordinates?: {
    lat: number;
    lng: number;
  };
  addressNotes?: string;
  fee: number;
  images?: string[];
  clientId: ObjectId;
  workerId?: ObjectId;
  categoryId: ObjectId;
  chatId?: ObjectId;
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
  name?: string;
  bio?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  address?: string;
  coordinates?: string;
  addressNotes?: string;
  rating?: number;
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
  confirmationImages?: string[];
  isDone?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IJobStatusSchema = Omit<IJobStatus, "_id">;

// ! REQUEST TYPES
export interface AuthRequest extends Request {
  user?: { _id: ObjectId };
}

export interface ITopUp {
  _id: ObjectId;
  topupId: string;
  userId: ObjectId;
  amount: number;
  transToken: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ITopUpSchema = Omit<ITopUp, "_id">;

// ? Socket for chat types

export interface IChat {
  _id: ObjectId;
  contents: IChatContent[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IChatContent {
  // make this required when integrated
  senderId?: ObjectId;
  message: string;
  createdAt: Date;
}

export type IChatSchema = Omit<IChat, "_id">;
