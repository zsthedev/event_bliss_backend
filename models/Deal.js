import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  rating: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    default: 0,
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Deal = mongoose.model('Deal', Schema);
