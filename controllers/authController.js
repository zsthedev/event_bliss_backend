import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { Food } from "../models/Food.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, role, password } = req.body;
  const file = req.file;

  if (!name || !email || !password || !file || !role) {
    return next(new ErrorHandler("Please Enter All Feilds", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 409));
  }

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await User.create({
    name: name,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    role: role,
    email: email,
    password: password,
  });
  sendToken(res, user, "Registered Successfully", 200);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter All Feilds", 400));
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Incorrect Email or Password", 409));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }

  sendToken(res, user, `Welcome Back ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      sameSite: "none",
      secure: true,

      expires: new Date(Date.now()),
    })
    .json({
      sucess: true,
      message: "User Logged Out Sucessfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    sucess: true,
    user,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please Enter all feilds", 400));
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Old Password"));
  }

  user.password = newPassword;

  await user.save();
  res.status(200).json({
    sucess: true,
    message: "Password changed Successfully",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();
  res.status(200).json({
    sucess: true,
    message: "Profile Updated Successfully",
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next(new ErrorHandler("Please Enter all feilds", 401));
  }

  const user = await User.findById(req.user._id);

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id, {
    resource_type: "image",
  });

  user.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };

  await user.save();
  res.status(200).json({
    sucess: true,
    message: "Profile Picutre Updated Successfully",
    user: user.avatar.public_id,
  });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please Enter all Feilds", 400));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  const token = await user.getResetToken();
  const url = `${process.env.FRONTEND_URL}/resetpassword/${token}`;
  const message = `Click on the link ${url} to reset your password`;
  await sendEmail(email, "Idevantek School Reset Passowrd", message);
  await user.save();
  res.status(200).json({
    sucess: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) {
    return next(new ErrorHandler("Please Enter all feilds", 401));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(
      new ErrorHandler("Incorrect reset Token or Expired Token", 400)
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    sucess: true,
    message: "Password Updated successfully",
  });
});

export const addToCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const food = await Food.findById(req.params.id);

  if (!food) {
    return next(new ErrorHandler("Invalid Food Id", 401));
  }

  const itemExists = user.cart.find((item) => {
    if (item.id.toString() === food._id.toString()) return true;
  });

  if (itemExists) {
    return next(new ErrorHandler("Food already exists in playlist", 400));
  }
  user.cart.push({
    id: food._id,
    name: food.name,
    price: food.price,
    category: food.category,
    image: food.image.url,
  });

  await user.save();

  res.status(200).json({
    sucess: true,
    message: "Added to Cart successfully",
  });
});

export const removeFromCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const food = await Food.findById(req.params.id);

  if (!food) {
    return next(new ErrorHandler("Invalid Food Id", 401));
  }
  const newCart = user.cart.filter((item) => {
    if (item.id.toString() !== food._id.toString()) return item;
  });

  user.cart = newCart;

  await user.save();

  res.status(200).json({
    sucess: true,
    message: "Food Removed from Cart successfully",
  });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    sucess: true,
    users,
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id, {
    resource_type: "image",
  });

  await user.deleteOne();

  res.status(200).json({
    sucess: true,
    message: "User Deleted Successfully",
  });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  user.role = user.role === "user" ? "admin" : "user";

  await user.save();

  res.status(200).json({
    sucess: true,
    message: `Role Updated to ${user.role} Successfully`,
  });
});

export const cartEmpty = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(id);

  user.cart = [];

  await user.save();

  res.status(200).json({
    sucess: true,
  });
});

// User.watch().on("change", async () => {
//   const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);
//   const subscription = await User.find({ "subscription.status": "active" });

//   stats[0].users = await User.countDocuments();
//   stats[0].subscriptions = subscription.length;
//   stats[0].createdAt = new Date(Date.now());

//   await stats[0].save();
// });
