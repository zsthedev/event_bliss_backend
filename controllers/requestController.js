import { request } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Food } from "../models/Food.js";
import { Request } from "../models/Request.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose";
import { Decor } from "../models/Decor.js";
import { Event } from "../models/Event.js";

export const createRequest = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { date, event, decor, numberOfPeople, food } = req.body;

  if (!date || !food || !decor || !numberOfPeople || !event) {
    return next(new ErrorHandler("Please enter all fields", 401));
  }

  // Check if a request with the same date already exists for the user
  const existingRequest = await Request.findOne({
    date: date,
    "client.id": user._id,
  });
  if (existingRequest) {
    return next(
      new ErrorHandler("You already have an appointment on this date", 409)
    );
  }

  // Check if each food item has an id
  // for (let f of food) {
  //   if (!f.id) {
  //     return next(new ErrorHandler("Please enter all fields", 401));
  //   }
  // }

  const request = await Request.create({
    date: date,
    event: event,
    decor: decor,
    numberOfPeople: numberOfPeople,
    client: {
      id: user._id,
    },
    food: food,
    status: "under review by admin",
  });

  user.events.push(request._id);
  await user.save();
  res.status(200).json({
    success: true,
    message: "Request Created Successfully",
  });
});

export const assignToVendor = catchAsyncError(async (req, res, next) => {
  const { reqId, venId } = req.params;

  if (!reqId || !venId) {
    return next(new ErrorHandler("Invalid Id", 401));
  }

  const request = await Request.findById(reqId);
  const vendor = await User.findById(venId);

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (!vendor) {
    return next(new ErrorHandler("Vendor not found", 404));
  }

  if (request.vendor.id) {
    if (request.vendor.id.equals(venId)) {
      return next(
        new ErrorHandler("Vendor is already assigned to this request", 400)
      );
    } else {
      return next(
        new ErrorHandler("Request is already assigned to another vendor", 400)
      );
    }
  }

  const foodIds = request.food.map((f) => new mongoose.Types.ObjectId(f.id));
  const foodItems = await Food.find({ _id: { $in: foodIds } });

  let totalFoodCost = 0;
  for (let foodItem of foodItems) {
    totalFoodCost += foodItem.price;
  }

  const costPerPerson = vendor.costPerPerson;
  const eventCost = 2000;
  const numberOfPeople = request.numberOfPeople;

  const totalCost = eventCost + costPerPerson * numberOfPeople + totalFoodCost;
  console.log(totalCost);

  request.vendor.id = vendor._id;
  vendor.events.push(request._id);
  request.status = "under review by Vendor";
  request.cost = totalCost;

  await vendor.save();
  await request.save();

  res.status(200).json({
    success: true,
    message: "Request Assigned To Vendor Successfully",
    totalCost: totalCost,
  });
});

export const approveVendor = catchAsyncError(async (req, res, next) => {
  const { reqId } = req.params;

  if (!reqId) {
    return next(new ErrorHandler("Invalid Id", 401));
  }

  const request = await Request.findById(reqId);

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  request.status = "fee_pending";

  await request.save();

  res.status(200).json({
    success: true,
    message: "Request Approved Successfully",
  });
});

export const getAllRequest = catchAsyncError(async (req, res, next) => {
  const requests = await Request.find({});
  res.status(200).json({
    success: true,
    requests,
  });
});

export const getMyEvents = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const requests = await Request.find({});

  let events = requests.filter(
    (r) =>
      (r.client && r.client.id.toString() === user._id.toString()) ||
      (r.vendor &&
        r.vendor.id &&
        r.vendor.id.toString() === user._id.toString())
  );

  res.status(200).json({
    success: true,
    events: events,
  });
});

export const getRequestDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Fetch the request by its ID
  const request = await Request.findById(id.toString());

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  // Fetch the vendor, event, and decor details
  const vendor = await User.findById(request.vendor.id);
  const event = await Event.findById(request.event.toString());
  const decor = await Decor.findById(request.decor.toString());

  console.log(vendor);
  if (!vendor || !event || !decor) {
    return next(new ErrorHandler("Vendor or Event or Decor Not Found"));
  }
  const foodIds = request.food.map((f) => f.id);
  const foodItems = await Food.find({ _id: { $in: foodIds } });

  const details = {
    vendor: {
      name: vendor.name,
      image: vendor.avatar.url,
      costPerPerson: vendor.costPerPerson,
    },
    event: {
      name: event.title,
      image: event.image.url,
    },
    decor: {
      name: decor.title,
      image: decor.image.url,
    },
    food: foodItems.map((food) => ({
      name: food.name,
      image: food.image.url,
      category: food.category,
      price: food.price,
    })),
  };

  // Send the response
  res.status(200).json({
    success: true,
    details: details,
  });
});

export const updateRequestStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const request = await Request.findById(id);

  if (!request) {
    return next(new ErrorHandler("Invalid ID"), 400);
  }

  request.status = "fee_paid";
  await request.save();
  // Fetch the request by its ID

  res.status(200).json({
    success: true,
    message: "Payment Done Successfully",
  });
});
