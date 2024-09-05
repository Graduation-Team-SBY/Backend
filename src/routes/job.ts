import { Router, Request, Response } from "express";
import multer from "multer";
import { Controller as JobController } from "../controllers/job";
import { authentication } from "../middlewares/authentication";
import { ObjectId } from "mongodb";

export const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", authentication, (req: Request & { user?: { _id: ObjectId } }, res: Response) => {
  const _id = req.user?._id;
  res.status(200).json({ _id });
});
router.post("/bersih", authentication, upload.array("image", 4), JobController.createJob);
