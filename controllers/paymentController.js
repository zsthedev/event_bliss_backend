import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Request } from "../models/Request.js";
import Stripe from "stripe";
import ErrorHandler from "../utils/errorHandler.js";

export const createCheckOutSession = catchAsyncError(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { id } = req.params;

  const request = await Request.findById(id);

  if (!request) {
    return next(new ErrorHandler("Invalid ID"));
  }

  const price = await stripe.prices.create({
    currency: "pkr",
    unit_amount: request.cost * 100,

    product_data: {
      name: `${request._id} Checkout Session`,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/client_events?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/client_events?canceled=true`,
  });

  res.status(200).json({
    sucess: true,
    sessionId: session.id,
  });
});
