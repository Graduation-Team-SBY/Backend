import { Router } from "express";
import { authentication } from "../middlewares/authentication";
import { Controller as PaymentController } from "../controllers/payment";

export const router = Router();

router.post("/topup", authentication, PaymentController.topup);
