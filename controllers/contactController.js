import { catchAsyncError } from "../middlewares/catchAsyncError";
import { Contact } from "../models/Contact";
import ErrorHandler from "../utils/errorHandler";

export const createContact = catchAsyncError(async (req, res, next) => {
  const { email, name, message } = req.body;
  if (!email || !name || !message) {
    return next(new ErrorHandler("Please enter all feilds"));
  }

  await Contact.create({
    email: email,
    name: name,
    message: message,
  });

  res.status(200).json({
    sucess: true,
    message: "Your query has been submitted successfully",
  });
});

export const getAllContacts = catchAsyncError(async (req, res, next) => {
  const contacts = await Contact.find();

  res.status(200).json({
    sucess: true,
    contacts,
  });
});
