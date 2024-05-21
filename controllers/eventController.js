import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Event } from "../models/Event.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary"

export const getAllEvents = catchAsyncError(async (req, res, next) => {
  const events = await Event.find();

  res.status(200).json({
    success: true,
    events,
  });
});

export const createEvent = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!title || !description || !file ) {
    return next(new ErrorHandler("Please enter all feilds"));
  }

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  const event = await Event.create({
    title: title,
    description: description,
    image: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Event Created Successfully",
  });
});

export const updateEvent = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const file = req.file;
  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event) {
    return next(new ErrorHandler("Invalid Event Id"));
  }

  if (file) {
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await cloudinary.v2.uploader.destroy(event.image.public_id, {
      resource_type: "image",
    });

    event.image.public_id = mycloud.public_id;
    event.image.url = mycloud.secure_url;
  }

  if (title) event.title = title;
  if (description) event.description = description;

  await event.save();
  res.status(200).json({
    success: true,
    message: "Event Updated Successfully",
  });
});

export const deleteEvent = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event) {
    return next(new ErrorHandler("Invalid Event Id"));
  }

  await cloudinary.v2.uploader.destroy(event.image.public_id, {
    resource_type: "image",
  });

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: "Event Deleted Successfully",
  });
});
