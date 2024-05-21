import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new ErrorHandler("User Must be Logged In to access this data", 400)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
});

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role != "admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to acess this data`,
        403
      )
    );
  }

  next();
};

export const authorizeSubscribedUsers = (req, res, next) => {
  if (req.user.subscription.status != "active" && req.user.role !== "admin") {
    return next(
      new ErrorHandler(`Only subscribed users can access this content`, 403)
    );
  }

  next();
};
