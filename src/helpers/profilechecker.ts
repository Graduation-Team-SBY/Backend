import { ObjectId } from 'mongodb';
import { Profile } from '../models/profile';
import { WorkerProfile } from '../models/workerprofile';

export const profileChecker = async (userId: ObjectId) => {
  try {
    const findProfile = await Profile.findOne({ userId }, '_id name');
    if (!findProfile?.name && !findProfile?.dateOfBirth && !findProfile?.address) {
      throw {name: 'ProfileRequired'}
    }
  } catch (err) {
    throw err;
  }
};

export const profileWorkerChecker = async (workerId: ObjectId) => {
  try {
    const findProfile = await WorkerProfile.findOne({ userId: workerId }, '_id name');
    if (!findProfile?.name && !findProfile?.dateOfBirth && !findProfile?.address) {
      throw {name: 'ProfileRequired'}
    }
  } catch (err) {
    throw err;
  }
};
