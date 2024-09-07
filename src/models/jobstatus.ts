import { model, Schema } from 'mongoose';
import { IJobStatusSchema } from '../types';

const jobStatusSchema = new Schema<IJobStatusSchema>({
  jobId: { type: Schema.Types.ObjectId, required: true },
  isWorkerConfirmed: { type: Boolean, default: false },
  isClientConfirmed: { type: Boolean, default: false },
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const JobStatus = model('JobStatus', jobStatusSchema);
