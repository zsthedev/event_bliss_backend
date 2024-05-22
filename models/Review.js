import mongoose from "mongoose";

const schema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  rating: { type: Number, default: 1 },
  message: {
    type: String,
    required: true,
  },
});

export const Review = mongoose.model("Review", schema);
