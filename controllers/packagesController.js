import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Deal } from "../models/Deal.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createPackage = catchAsyncError(async (req, res, next) => {
  const { title, event, decor, numberOfPeople, items, price } = req.body;
  if (
    !title ||
    !items ||
    !event ||
    !decor ||
    !numberOfPeople ||
    !items ||
    !price
  ) {
    return next(new ErrorHandler("Please enter all feilds", 401));
  }

  let deal = await Deal.create({
    title: title,
    event: event,
    decor: decor,
    numberOfPeople: numberOfPeople,
    items: items,
    price: price,
  });

  res.status(200).json({
    success: true,
    message: "Package created successfully",
  });
});

export const updatePackage = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, event, decor, numberOfPeople, items, price } = req.body;
  const deal = await Deal.findById(id);

  if (!deal) {
    return next(new ErrorHandler("Invalid Deal Id"));
  }

  if (title) deal.title = title;
  if (event) deal.event = event;
  if (decor) deal.decor = decor;
  if (decor) deal.decor = decor;
  if (numberOfPeople) deal.numberOfPeople = numberOfPeople;
  if (items) deal.items = items;
  if (price) deal.price = price;

  res.status(200).json({
    success: true,
    message: "Package updated successfully",
  });
});

export const getAllPackages = catchAsyncError(async (req, res, next) => {
  const deals = await Deal.find();

  res.status(200).json({
    success: true,
    deals,
  });
});

export const getDeal = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deal = await Deal.findById(id).populate("event").populate("decor").populate("items");
  
  
  if (!deal) {
    return next(new ErrorHandler("Invalid Deal Id"));
  }
  res.status(200).json({
    success: true,
    deal,
   
  });
});

export const deleteDeal = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deal = await Deal.findById(id);
  if (!deal) {
    return next(new ErrorHandler("Invalid Deal Id"));
  }

  await deal.deleteOne();
  res.status(200).json({
    success: true,
    message: "Package Deleted Successfully",
  });
});
