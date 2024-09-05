import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";

export class Controller {
  static async createUser(req: Request & { user?: { _id: ObjectId } }, res: Response, next: NextFunction) {
    try {
    } catch (err) {}
  }
}
