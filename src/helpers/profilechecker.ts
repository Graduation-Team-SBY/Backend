import { ObjectId } from 'mongodb';
import { Profile } from '../models/profile';

export const profileChecker = async (userId: ObjectId) => {
  try {
    const findProfile = await Profile.findOne({ userId }, '_id name');
    if (!findProfile?.name) {
      throw {name: 'ProfileRequired'}
    }
  } catch (err) {
    throw err;
  }
};
