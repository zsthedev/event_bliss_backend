import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Food } from "../models/Food.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

export const getAllMenu = catchAsyncError(async (req, res, next) => {
  const menu = await Food.find();

  res.status(200).json({
    success: true,
    menu,
  });
});

export const createFood = catchAsyncError(async (req, res, next) => {
  const { name, price, description, category } = req.body;
  const file = req.file;

  if (!name || !price || !description || !file || !category) {
    return next(new ErrorHandler("Please enter all feilds"));
  }

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  const food = await Food.create({
    name: name,
    price: price,
    description: description,
    category: category,
    image: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Food Item Created Successfully",
  });
});

export const updateFood = catchAsyncError(async (req, res, next) => {
  const { name, price, description, category } = req.body;
  const file = req.file;
  const { id } = req.params;
  const food = await Food.findById(id);

  if (!food) {
    return next(new ErrorHandler("Invalid Food Id"));
  }
 

  if (file) {
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await cloudinary.v2.uploader.destroy(food.image.public_id, {
      resource_type: "image",
    });

    food.image.public_id = mycloud.public_id;
    food.image.url = mycloud.secure_url;
  }

  if (name) food.name = name;
  if (price) food.price = price;
  if (description) food.description = description;
  if (category) food.category = category;

  await food.save();
  res.status(200).json({
    success: true,
    message: "Food Item Updated Successfully",
  });
});

export const deleteFood = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const food = await Food.findById(id);

  if (!food) {
    return next(new ErrorHandler("Invalid Food Id"));
  }

  await cloudinary.v2.uploader.destroy(food.image.public_id, {
    resource_type: "image",
  });

  await food.deleteOne();

  res.status(200).json({
    success: true,
    message: "Food Item Deleted Successfully",
  });
});
