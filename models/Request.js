import mongoose from "mongoose";

const schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Event",
  },

  decor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Decor",
  },

  client: {
    id: mongoose.Schema.Types.ObjectId,
    // ref: "User",
  },

  vendor: {
    id: mongoose.Schema.Types.ObjectId,
    // ref: "User",
  },

  food: [
    {
      id: mongoose.Schema.Types.ObjectId,
      //   ref: "Food",
    },
  ],

  status: {
    type: String,
    required: true,
  },

  cost: {
    type: Number,
    default: 0,
  },

  numberOfPeople: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Request = mongoose.model("Request", schema);
