import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validate } from "node-cron";
import { type } from "os";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    validator: validate.isEmail,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },

  role: {
    type: String,
    required: true,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    select: false,
    minLength: [6, "Password must be at least 6 characters"],
  },

  subscription: {
    id: String,
    status: String,
  },

  events: [
    {
      id: mongoose.Schema.Types.ObjectId,
    },
  ],

  costPerPerson: {
    type: Number,
    default: 1000,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
  },

  cart: [
    {
      id: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      image: {
        type: String,
        required: true,
      },
    },
  ],



  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: String,
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next;
});

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", schema);
