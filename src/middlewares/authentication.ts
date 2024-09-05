import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../helpers/jwt";
import { User } from "../models/user";

export const authentication = async (req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw {name: 'Unauthenticated'};
    }

    const [type, token] = auth.split(' ');
    if (!type || type !== 'Bearer') {
      throw {name: 'Unauthenticated'};
    }
    if (!token) {
      throw {name: 'Unauthenticated'};
    }
    
    const payload = verifyToken(token) as { _id: string, iat: number };
    const findUser = await User.findById(new ObjectId(payload._id));
    if (!findUser) {
      throw {name: 'Unauthenticated'};
    }
    req.user = { _id: findUser._id } 
    next();
  } catch (err) {
    next(err);
  }
}

export const authWorker = async (req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw {name: 'Unauthenticated'};
    }

    const [type, token] = auth.split(' ');
    if (!type || type !== 'Bearer') {
      throw {name: 'Unauthenticated'};
    }
    if (!token) {
      throw {name: 'Unauthenticated'};
    }
    
    const payload = verifyToken(token) as { _id: string, iat: number };
    const findUser = await User.findById(new ObjectId(payload._id));
    if (!findUser) {
      throw {name: 'Unauthenticated'};
    }
    if (!findUser.isWorker) {
      throw {name: 'Forbidden'};
    }
    req.user = { _id: findUser._id } 
    next();
  } catch (err) {
    next(err);
  }
}