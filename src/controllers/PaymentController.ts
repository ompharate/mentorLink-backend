import { Request, Response } from "express";
import Razorpay from "razorpay";

class PaymentController {
  private razorpay: Razorpay;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay key ID and secret must be set in environment variables"
      );
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  public createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, currency } = req.body;

      if (!amount || !currency) {
        res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
        return;
      }

      const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await this.razorpay.orders.create(options);

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}

const paymentController = new PaymentController();
export default paymentController;
