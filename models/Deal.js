import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  decor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Decor",
  },

  numberOfPeople: {
    type: Number,
    default: 0,
  },

  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  ],

  price: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});


export const Deal = mongoose.model('Deal', schema)