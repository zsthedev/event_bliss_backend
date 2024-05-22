import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Request } from "../models/Request.js";
import Stripe from "stripe";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";

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
    success_url: `${process.env.FRONTEND_URL}?success=true?reqId=${request._id}`,
    cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
  });

  res.status(200).json({
    sucess: true,
    sessionId: session.id,
    requestId: request._id,
  });
});

export const createCartCheckout = catchAsyncError(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const user = await User.findById(req.user._id);

  if (user.cart.length === 0) {
    return next(new ErrorHandler("Cart cant be empty"));
  }

  const lineItems = user.cart.map((item) => ({
    price_data: {
      currency: "pkr",
      product_data: {
        name: item.name,
        images: [item.image],
      },

      unit_amount: item.price * 100,
    },
  }));

 
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}?csuccess=true`,
    cancel_url: `${process.env.FRONTEND_URL}?ccanceled=true`,
  });

  res.status(200).json({
    sucess: true,
    sessionId: session.id,
   
  });
});
