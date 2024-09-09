import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types';
import midtransClient from 'midtrans-client'
import { User } from '../models/user';
import { TopUp } from '../models/topup';

export class Controller {
  static async topup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });
      const topupId = `${new Date().getTime()}${req.user?._id}`;

      const findUser = await User.findById(req.user?._id);

      let parameter = {
        transaction_details: {
          order_id: topupId,
          gross_amount: Number(amount),
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: findUser?.email,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      let transactionToken = transaction.token;

      const newTopUp = new TopUp({
        topupId,
        amount,
        transToken: transactionToken,
        userId: req.user?._id
      });
      await newTopUp.save();
      res.status(200).json({ trans_token: transactionToken, topupId });
    } catch (err) {
      next(err);
    }
  }

  // static async template(req: AuthRequest, res: Response, next: NextFunction) {
  //   try {

  //   } catch (err) {
  //     next(err);
  //   }
  // }
}
