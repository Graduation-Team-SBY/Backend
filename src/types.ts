export interface IUser {
  _id: string;
  email: string;
  phoneNumber: string;
  password: string;
  isWorker?: boolean;
}

export type IUserSchema = Omit<IUser, '_id'>;

export interface IProfile {
  _id: string;
  name: string;
  dateOfBirth: Date;
  profilePicture?: string;
  address?: string;
  userId: string;
}

export type IProfileSchema = Omit<IProfile, '_id'>;

export interface IWallet {
  _id: string;
  amount: number;
  userId: string;
}

export type IWalletSchema = Omit<IWallet, '_id'>;

export interface ICategory {
  _id: string;
  name: string;
  description: string;
}

export type ICategorySchema = Omit<ICategory, '_id'>;

export interface IJob {
  _id: string;
  description: string;
  address: string;
  fee: number;
  clientId: string;
  workerId: string;
  categoryId: string;
  jobStatusId: string;
}

export type IJobSchema = Omit<IJob, '_id'>;

export interface IJobRequest {
  _id: string;
  jobId: string;
  workerId: string;
}

export type IJobRequestSchema = Omit<IJobRequest, '_id'>;

export interface IReview {
  _id: string;
  transactionId: string;
  description?: string;
  rating: number;
  images: string[];
}

export type IReviewSchema = Omit<IReview, '_id'>;

export interface IWorkerProfile {
  _id: string;
  userId: string;
  bio: string;
  joinDate: Date;
  rating: number;
}

export type IWorkerProfileSchema = Omit<IWorkerProfile, "_id">;

export interface IHistory {
  _id: string;
  transactionId: string;
}
export type IHistorySchema = Omit<IHistory, "_id">;

export interface ITransaction {
  _id: string;
  clientId: string;
  workerId: string;
  jobId: string;
}

export type ITransactionSchema = Omit<ITransaction, "_id">;

export interface IJobStatus {
  _id: string;
  isWorkerConfirmed?: boolean;
  isClientConfirmed?: boolean;
  isDone?: boolean;
}

export type IJobStatusSchema = Omit<IJobStatus, '_id'>