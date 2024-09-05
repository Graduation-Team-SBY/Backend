import { Router, Request, Response } from "express";
import { authentication } from "../middlewares/authentication";
import { ObjectId } from "mongodb";
import { Controller as UserController } from "../controllers/user";

export const router = Router();

router.get("/", authentication, (req: Request & { user?: { _id: ObjectId } }, res: Response) => {
  const _id = req.user?._id;
  res.status(200).json({ _id });
});
router.post("/", authentication, UserController.createUser);
