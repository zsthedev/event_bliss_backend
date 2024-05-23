import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Review } from "../models/Review.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createReview = catchAsyncError(async (req, res, next) => {
  const { author, ratings, message } = req.body;
  if (!author || !ratings || !message) {
    return next(new ErrorHandler("Please enter all feilds", 401));
  }

  await Review.create({
    author: author,
    ratings: ratings,
    message: message,
  });

  res.status(200).json({
    sucess: true,
    message: "Review created successfully",
  });
});

export const getAllReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find({}).populate("author");

  res.status(200).json({
    sucess: true,
    reviews: reviews,
  });
});
