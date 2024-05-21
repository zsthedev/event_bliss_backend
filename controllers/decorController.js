import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Decor } from "../models/Decor.js";
import { Event } from "../models/Event.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary"

export const getAllDecors = catchAsyncError(async (req, res, next) => {
  const decors = await Decor.find();

  res.status(200).json({
    success: true,
    decors,
  });
});

export const createDecor = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!title || !description || !file ) {
    return next(new ErrorHandler("Please enter all feilds"));
  }

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  const decor = await Decor.create({
    title: title,
    description: description,
    image: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Decor Created Successfully",
  });
});

export const updateDecor = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const file = req.file;
  const { id } = req.params;
  const decor = await Decor.findById(id);

  if (!decor) {
    return next(new ErrorHandler("Invalid Event Id"));
  }

  if (file) {
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await cloudinary.v2.uploader.destroy(event.image.public_id, {
      resource_type: "image",
    });

    decor.image.public_id = mycloud.public_id;
    decor.image.url = mycloud.secure_url;
  }

  if (title) decor.title = title;
  if (description) decor.description = description;

  await decor.save();
  res.status(200).json({
    success: true,
    message: "Decor Updated Successfully",
  });
});

export const deleteDecor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const decor = await Decor.findById(id);

  if (!decor) {
    return next(new ErrorHandler("Invalid Event Id"));
  }

  await cloudinary.v2.uploader.destroy(event.image.public_id, {
    resource_type: "image",
  });

  await decor.deleteOne();

  res.status(200).json({
    success: true,
    message: "Event Deleted Successfully",
  });
});
