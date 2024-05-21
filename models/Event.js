import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
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

  packages: [
    {
      id: mongoose.Schema.Types.ObjectId,
    //   ref: 'Deal'
    },
  ],

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Event = mongoose.model("Event", schema);
